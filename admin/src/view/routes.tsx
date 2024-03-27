import Permissions from 'src/security/permissions';
import config from 'src/config';

const permissions = Permissions.values;

const privateRoutes = [
  {
    path: '/',
    loader: () => import('src/view/user/list/UserPage'),
    permissionRequired: permissions.userRead,
    exact: true,
  },

  {
    path: '/profile',
    loader: () => import('src/view/auth/ProfileFormPage'),
    permissionRequired: null,
    exact: true,
  },

  {
    path: '/company',
    loader: () => import('src/view/company/company'),
    permissionRequired: null,
    exact: true,
  },
  {
    path: '/visa',
    loader: () =>
      import('src/view/coupons/list/CouponsListPage'),
    permissionRequired: permissions.couponsRead,
    exact: true,
  },

  {
    path: '/category',
    loader: () =>
      import('src/view/category/list/CategoryListPage'),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: '/category/new',
    loader: () =>
      import('src/view/category/form/CategoryFormPage'),
    permissionRequired: permissions.categoryCreate,
    exact: true,
  },
  {
    path: '/category/importer',
    loader: () =>
      import(
        'src/view/category/importer/CategoryImporterPage'
      ),
    permissionRequired: permissions.categoryImport,
    exact: true,
  },
  {
    path: '/category/:id/edit',
    loader: () =>
      import('src/view/category/form/CategoryFormPage'),
    permissionRequired: permissions.categoryEdit,
    exact: true,
  },
  {
    path: '/category/:id',
    loader: () =>
      import('src/view/category/view/CategoryViewPage'),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },

  {
    path: '/coupons',
    loader: () =>
      import('src/view/coupons/list/CouponsListPage'),
    permissionRequired: permissions.couponsRead,
    exact: true,
  },
  {
    path: '/coupons/new',
    loader: () =>
      import('src/view/coupons/form/CouponsFormPage'),
    permissionRequired: permissions.couponsCreate,
    exact: true,
  },
  {
    path: '/coupons/importer',
    loader: () =>
      import(
        'src/view/coupons/importer/CouponsImporterPage'
      ),
    permissionRequired: permissions.couponsImport,
    exact: true,
  },
  {
    path: '/coupons/:id/edit',
    loader: () =>
      import('src/view/coupons/form/CouponsFormPage'),
    permissionRequired: permissions.couponsEdit,
    exact: true,
  },
  {
    path: '/coupons/:id',
    loader: () =>
      import('src/view/coupons/view/CouponsViewPage'),
    permissionRequired: permissions.couponsRead,
    exact: true,
  },
  {
    path: '/check',
    loader: () => import('src/view/visa/Check'),
    permissionRequired: permissions.userRead,
    exact: true,
  },

  {
    path: '/password-change',
    loader: () =>
      import('src/view/auth/PasswordChangeFormPage'),
    permissionRequired: null,
    exact: true,
  },

  {
    path: '/tenant',
    loader: () =>
      import('src/view/tenant/list/TenantListPage'),
    permissionRequired: null,
    exact: true,
  },
  {
    path: '/tenant/new',
    loader: () =>
      import('src/view/tenant/form/TenantFormPage'),
    permissionRequired: null,
    exact: true,
  },
  {
    path: '/tenant/:id/edit',
    loader: () =>
      import('src/view/tenant/form/TenantFormPage'),
    permissionRequired: null,
    exact: true,
  },

  {
    path: '/user',
    loader: () => import('src/view/user/list/UserPage'),
    permissionRequired: permissions.userRead,
    exact: true,
  },

  {
    path: '/user/new',
    loader: () => import('src/view/user/new/UserNewPage'),
    permissionRequired: permissions.userCreate,
    exact: true,
  },

  {
    path: '/user/importer',
    loader: () =>
      import('src/view/user/importer/UserImporterPage'),
    permissionRequired: permissions.userImport,
    exact: true,
  },
  {
    path: '/user/:id/edit',
    loader: () => import('src/view/user/edit/UserEditPage'),
    permissionRequired: permissions.userEdit,
    exact: true,
  },
  {
    path: '/user/:id',
    loader: () => import('src/view/user/view/UserDetails'),
    permissionRequired: permissions.userRead,
    exact: true,
  },

  {
    path: '/audit-logs',
    loader: () => import('src/view/auditLog/AuditLogPage'),
    permissionRequired: permissions.auditLogRead,
  },

  {
    path: '/settings',
    loader: () =>
      import('src/view/settings/SettingsFormPage'),
    permissionRequired: permissions.settingsEdit,
  },

  {
    path: '/paymentsettings',
    loader: () =>
      import(
        'src/view/paymentsettings/list/PaymentsettingsListPage'
      ),
    permissionRequired: permissions.paymentsettingsRead,
    exact: true,
  },
  {
    path: '/paymentsettings/new',
    loader: () =>
      import(
        'src/view/paymentsettings/form/PaymentsettingsFormPage'
      ),
    permissionRequired: permissions.paymentsettingsCreate,
    exact: true,
  },
  {
    path: '/paymentsettings/importer',
    loader: () =>
      import(
        'src/view/paymentsettings/importer/PaymentsettingsImporterPage'
      ),
    permissionRequired: permissions.paymentsettingsImport,
    exact: true,
  },
  {
    path: '/paymentsettings/:id/edit',
    loader: () =>
      import(
        'src/view/paymentsettings/form/PaymentsettingsFormPage'
      ),
    permissionRequired: permissions.paymentsettingsEdit,
    exact: true,
  },
  {
    path: '/paymentsettings/:id',
    loader: () =>
      import(
        'src/view/paymentsettings/view/PaymentsettingsViewPage'
      ),
    permissionRequired: permissions.paymentsettingsRead,
    exact: true,
  },
].filter(Boolean);

const publicRoutes = [
  {
    path: '/auth/signin',
    loader: () => import('src/view/auth/SigninPage'),
  },
  {
    path: '/auth/signup',
    loader: () => import('src/view/auth/SignupPage'),
  },
  {
    path: '/auth/forgot-password',
    loader: () =>
      import('src/view/auth/ForgotPasswordPage'),
  },
].filter(Boolean);

const emptyTenantRoutes = [
  {
    path: '/auth/tenant',
    loader: () => import('src/view/auth/TenantPage'),
  },
].filter(Boolean);

const emptyPermissionsRoutes = [
  {
    path: '/auth/empty-permissions',
    loader: () =>
      import('src/view/auth/EmptyPermissionsPage'),
  },
].filter(Boolean);

const emailUnverifiedRoutes = [
  {
    path: '/auth/email-unverified',
    loader: () =>
      import('src/view/auth/EmailUnverifiedPage'),
  },
].filter(Boolean);

const simpleRoutes = [
  {
    path: '/auth/password-reset',
    loader: () => import('src/view/auth/PasswordResetPage'),
  },
  {
    path: '/auth/invitation',
    loader: () => import('src/view/auth/InvitationPage'),
  },
  {
    path: '/auth/verify-email',
    loader: () => import('src/view/auth/VerifyEmailPage'),
  },
  {
    path: '/403',
    loader: () =>
      import('src/view/shared/errors/Error403Page'),
  },
  {
    path: '/500',
    loader: () =>
      import('src/view/shared/errors/Error500Page'),
  },
  {
    path: '**',
    loader: () =>
      import('src/view/shared/errors/Error404Page'),
  },
].filter(Boolean);

export default {
  privateRoutes,
  publicRoutes,
  emptyTenantRoutes,
  emptyPermissionsRoutes,
  emailUnverifiedRoutes,
  simpleRoutes,
};
