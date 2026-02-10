import type { OrderJson } from '@modules/order/domain/order'
import type { Responses } from '@shared/application/interfaces/responses'

import { Order } from '@modules/order/domain/order'
import { OrderItem } from '@modules/order/domain/orderItem'
import type { UseCase } from '@shared/commons/core/UseCase'
import type { CreateOrderDTO, OrderRepositoryPort } from '../ports/orderRepository.port'

import { Inject, Injectable } from '@nestjs/common'
import { RequestContextService } from '@shared/application/context/AppRequestContext'

import { StatusValues } from '@shared/application/types/status'

interface CreateOrderSuccess {
  orderValidated: OrderJson
}

interface CreateOrderError {
  error: string
}

export type CreateOrderUseCaseResponse = Promise<Responses<CreateOrderSuccess | CreateOrderError>>

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderDTO, CreateOrderUseCaseResponse> {
  private readonly useCaseName = this.constructor.name

  private readonly log = (logMessage: string, ...args: string[]) =>
    console.log(`[${this.useCaseName}]-[${RequestContextService.getRequestId()}]: ${logMessage}`, ...args)

  private readonly success = {
    status: StatusValues.SUCCESS,
    message: 'created order successfully',
  }

  private readonly error = {
    status: StatusValues.ERROR,
    message: 'error creating order',
  }

  constructor(@Inject('OrderRepositoryPort') private readonly orderRepository: OrderRepositoryPort) {}

  public async execute(dto: CreateOrderDTO): CreateOrderUseCaseResponse {
    const { items } = dto

    this.log('dto', JSON.stringify(dto))

    const itemResults = items.map(item => OrderItem.create({ value: item }))

    const failedItems = itemResults.filter(result => result.isFailure)
    if (failedItems.length > 0) {
      const errors = failedItems.map(result => result.errorValue()).join(', ')
      this.log('Failed to create order items', errors)
      return {
        status: this.error.status,
        message: this.error.message,
        data: {
          error: `Failed to create order items: ${errors}`,
        },
      }
    }

    const validItems = itemResults.map(result => result.getValue())

    const orderResult = Order.create({ items: validItems })

    if (orderResult.isFailure) {
      const errorMessage = String(orderResult.errorValue() || 'Failed to create order')
      this.log('Failed to create order', errorMessage)
      return {
        status: this.error.status,
        message: this.error.message,
        data: {
          error: errorMessage,
        },
      }
    }

    const order = orderResult.getValue()

    const savedOrder = await this.orderRepository.save(order)

    this.log('Order created successfully', JSON.stringify(savedOrder.toJson()))

    return {
      status: this.success.status,
      message: this.success.message,
      data: {
        orderValidated: savedOrder.toJson(),
      },
    }
  }
}
