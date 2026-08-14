const internalSource = '^(apps|packages)/';

const productionSource =
  '^(apps/[^/]+|packages/(foundations|kernel|platforms|universes)/[^/]+)/src/';

const packageSource = '^packages/(foundations|kernel|platforms|universes)/([^/]+)/';

const packageProductionSource = '^packages/(foundations|kernel|platforms|universes)/([^/]+)/src/';

const packageInternalSource = '^packages/(foundations|kernel|platforms|universes)/[^/]+/src/';

const packageInfrastructure = [
  '^packages/(foundations|kernel|platforms|universes)/[^/]+/src/infrastructure([./]|$)',
  '^packages/(foundations|kernel|platforms|universes)/[^/]+/dist/infrastructure([./]|$)',
];

export default {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Source dependencies must not form circular dependency chains.',
      severity: 'error',
      from: {
        path: internalSource,
      },
      to: {
        circular: true,
      },
    },

    {
      name: 'not-to-unresolvable',
      comment: 'Every statically resolvable source import must resolve.',
      severity: 'error',
      from: {
        path: internalSource,
      },
      to: {
        couldNotResolve: true,
      },
    },

    {
      name: 'no-undeclared-package-dependencies',
      comment: 'External packages must be declared in the closest package.json.',
      severity: 'error',
      from: {
        path: internalSource,
      },
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },

    {
      name: 'no-dev-dependencies-from-production-source',
      comment: 'Production source must not depend on packages declared only as devDependencies.',
      severity: 'error',
      from: {
        path: productionSource,
      },
      to: {
        dependencyTypes: ['npm-dev'],
      },
    },

    {
      name: 'no-cross-application-dependencies',
      comment: 'Applications must not import source from another application.',
      severity: 'error',
      from: {
        path: '^apps/([^/]+)/',
      },
      to: {
        path: '^apps/',
        pathNot: '^apps/$1/',
      },
    },

    {
      name: 'applications-do-not-deep-import-package-source',
      comment:
        'Applications must consume packages through declared package exports rather than package-internal src files.',
      severity: 'error',
      from: {
        path: '^apps/[^/]+/',
      },
      to: {
        path: packageInternalSource,
      },
    },

    {
      name: 'packages-do-not-deep-import-other-package-source',
      comment:
        'Packages must consume other packages through declared package exports rather than package-internal src files.',
      severity: 'error',
      from: {
        path: packageSource,
      },
      to: {
        path: packageInternalSource,
        pathNot: '^packages/$1/$2/src/',
      },
    },

    {
      name: 'package-production-does-not-depend-on-foreign-infrastructure',
      comment:
        'Package production source must depend on another package through its public semantic Contract rather than its infrastructure implementation. Application composition roots and integration tests may compose infrastructure.',
      severity: 'error',
      from: {
        path: packageProductionSource,
      },
      to: {
        path: packageInfrastructure,
        pathNot: '^packages/$1/$2/',
      },
    },

    {
      name: 'foundations-do-not-depend-upward',
      comment:
        'Foundations must remain independent of Kernel, Platforms, Universes, and Applications.',
      severity: 'error',
      from: {
        path: '^packages/foundations/',
      },
      to: {
        path: '^(apps/|packages/(kernel|platforms|universes)/)',
      },
    },

    {
      name: 'kernel-does-not-depend-upward',
      comment: 'Kernel may depend on Foundations but not Platforms, Universes, or Applications.',
      severity: 'error',
      from: {
        path: '^packages/kernel/',
      },
      to: {
        path: '^(apps/|packages/(platforms|universes)/)',
      },
    },

    {
      name: 'platforms-do-not-depend-upward',
      comment: 'Platforms may depend on Kernel and Foundations but not Universes or Applications.',
      severity: 'error',
      from: {
        path: '^packages/platforms/',
      },
      to: {
        path: '^(apps/|packages/universes/)',
      },
    },

    {
      name: 'universes-do-not-depend-on-applications',
      comment: 'Universes must remain independent of application composition roots.',
      severity: 'error',
      from: {
        path: '^packages/universes/',
      },
      to: {
        path: '^apps/',
      },
    },
  ],

  options: {
    combinedDependencies: false,

    tsConfig: {
      fileName: 'tsconfig.base.json',
    },

    tsPreCompilationDeps: true,

    doNotFollow: {
      path: '(^|/)node_modules(/|$)',
    },

    exclude: {
      path: '^packages/foundations/database/(src|dist)/generated/',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['main', 'types', 'typings'],
    },

    skipAnalysisNotInRules: true,
  },
};
