import antfu from '@antfu/eslint-config'

export default antfu({
  // Configuración para TypeScript
  typescript: true,
  
  // Habilitar formateo automático (reemplaza Prettier)
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
    xml: true,
  },
  
  // Reglas de estilo
  stylistic: {
    indent: 2,        // 2 espacios
    quotes: 'single', // Comillas simples
    semi: true,      // Sin punto y coma (puedes cambiar a true si prefieres)
  },
  
  // Archivos a ignorar
  ignores: [
    'dist',
    'coverage',
    '.eslintcache',
    '*.js',           // Ignora archivos JS en la raíz (como este config)
    '**/*.md',        // Ignorar archivos Markdown
    '_docs/**',       // Ignorar documentación
    '.claude/**',     // Ignorar configuración de Claude
    'TODO.md',        // Ignorar archivo TODO
    'node_modules',   // Ignorar dependencias
  ],
  
  // Reglas personalizadas (ajusta según tu preferencia)
  rules: {
    // Permitir console.warn y console.error en development
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Permitir underscore en nombres de variables (_id de MongoDB)
    'no-underscore-dangle': 'off',

    // NestJS usa clases sin métodos estáticos a veces
    'class-methods-use-this': 'off',

    // TypeScript maneja esto mejor
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Para imports de NestJS
    'import/prefer-default-export': 'off',

    // Permitir múltiples clases por archivo (común en DDD)
    'max-classes-per-file': 'off',

    // Permitir unused vars que empiecen con _
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Desactivar la regla de import type para NestJS
    // NestJS requiere imports reales (no type-only) para dependency injection
    // porque necesita las clases en runtime, no solo sus tipos
    '@typescript-eslint/consistent-type-imports': 'off',

    // Permitir imports de valores que se usan solo como tipos en DI
    '@typescript-eslint/no-import-type-side-effects': 'off',

    // Permitir uso de Buffer global (común en Node.js)
    'node/prefer-global/buffer': 'off',

    // Desactivar ordenamiento estricto de imports (puede ser muy restrictivo)
    'perfectionist/sort-imports': 'off',

    // Permitir variables no usadas en tests (mocks, fixtures)
    'unused-imports/no-unused-vars': 'off',
  },
})
