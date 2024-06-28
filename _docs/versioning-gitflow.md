# Versioning && Gitflow 📌

- Used [SemVer](http://semver.org/) for semantic versioning.

## Rules 📢

### Nomenclature Branches

- feature-\*

- **release** _----> Protected_

- hotfix-\*

- **main** _----> Protected_

#### Ejemplo

```bin
feature-login-re-v1-1
```

#### Rules

```bin
No uppercase letters allowed

No underscores allowed

No spaces allowed

No special characters allowed ($#&%?¿)
```

### REGEX BRANCH

```bin
(((feature|release|hotfix){1}-{1})\/*([a-z|0-9|-]*)$)|develop|release|main
```

### REGEX TAG

- To define a tag, you must follow the following pattern:

```bin
v[0-9]+\.[0-9]+\.[0-9]+(-[a-z|0-9|-]*)$
```

## Mas Información 📖

You can find more information about gitflow here:

- [Git flow Documentation](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow)