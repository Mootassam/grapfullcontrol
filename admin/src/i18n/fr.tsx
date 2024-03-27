const fr = {
  common: {
    or: '或',
    cancel: '取消',
    reset: '重置',
    save: '保存',
    search: '搜索',
    edit: '编辑',
    new: '新',
    export: '出口',
    noDataToExport: '没有要导出的数据',
    import: '导入',
    discard: '丢弃',
    yes: '是的',
    no: '不',
    pause: '暂停',
    areYouSure: '你确定吗？',
    view: '视图',
    destroy: '删除',
    mustSelectARow: '必须选择行',
    start: '开始',
    end: '结束',
    select: '选择',
    continue: '继续',
    configurations: '配置',
    filters: '过滤器',

  },

  app: {
    title: '香港电子收据',
  },

  api: {
    menu: 'API',
  },

  entities: {
 
   
 



  },



  auth: {
    tenants: '工作区',
    profile: {
      title: '个人资料',
      success: '资料更新成功',
    },
    createAnAccount: '创建账户',
    rememberMe: '记住我',
    forgotPassword: '忘记密码',
    signin: '登录',
    signup: '注册',
    signout: '注销',
    alreadyHaveAnAccount:
      '已有账户？ 登录。',
    social: {
      errors: {
        'auth-invalid-provider':
          'Cet e-mail est déjà enregistré auprès d un autre fournisseur.',
        'auth-no-email': `L'email associé à ce compte est privé ou inexistant.`,
      },
    },
    signinWithAnotherAccount:
      'Connectez-vous avec un autre compte',
    emailUnverified: {
      message: `Veuillez confirmer votre email à <strong>{0}</strong> continuer.`,
      submit: `Renvoyer la vérification par e-mail`,
    },
    emptyPermissions: {
      message: `您还没有权限。 等待管理员给你权限`,
    },
    passwordResetEmail: {
      message:
        'Envoyer un e-mail de réinitialisation du mot de passe',
      error: `E-mail non reconnu`,
    },
    passwordReset: {
      message: '重置密码',
    },
    passwordChange: {
      title: '更改密码',
      success: '修改密码成功',
      mustMatch: '密码必须匹配',
    },
    emailAddressVerificationEmail: {
      error: `电子邮件无法识别`,
    },
    verificationEmailSuccess: `验证邮件发送成功`,
    passwordResetEmailSuccess: `密码重置邮件发送成功`,
    passwordResetSuccess: `密码修改成功`,
    verifyEmail: {
      success: '邮箱验证成功。',
      message:
        'Juste un instant, votre email est en cours de vérification...',
    },
  },

  roles: {
    admin: {
      label: '管理员',
      description: '完全访问所有资源',
    },
    adherent: {
      label: 'Adherent',
      description: 'Accès aux rôles personnalisés',
    },
    member: {
      label: 'Membre',
      description: 'Accès aux rôles personnalisés',
    },
  },

  user: {
    fields: {
      id: '编号',
      avatars: '头像',
      email: '电子邮件',
      emails: '电子邮件',
      fullName: '姓名',
      firstName: '名字',
      lastName: '姓氏',
      status: '状态',
      role: '角色',
      createdAt: '创建于',
      updatedAt: '更新时间',
      roleUser: '角色/用户',
      phoneNumber:"电话号码",
      roles: '角色',
      createdAtRange: '创建于',
      password: '密码',
      oldPassword: '旧密码',
      newPassword: '新密码',
      newPasswordConfirmation:
        '确认新密码',
      rememberMe: '记住我',
    },
    sector: {
      AGRO_ALIMENTAIRE: 'Industrie alimentaire',
      ASSURANCES: 'Assurance',
      AUDIOVISUEL: 'Audio-visuel',
      BANCAIRE: 'Bancaire',
      CHIMIE: 'Chimie',
      COMPOSANTS_AUTOMOBILES: 'Composants automobiles',
      DISTRIBUTION: 'Distribution',
      DISTRIBUTION_AUTOMOBILE: 'Automotive Distribution',
      DIVERS: 'Various',
      FINANCIER: 'Financial',
      HOLDING: 'Holding',
      IMMOBILIER: 'Real estate',
      INDUSTRIEL: 'Industrial',
      LEASING: 'Leasing',
      LOGISTIQUE_TRANSPORT: 'Logistics and transport',
      PHARMACEUTIQUE: 'Pharmaceutical',
      SANTÉ: 'Health',
      TOURSIME: 'Tourism',
      INFORMATION_TECHNOLOGY: 'Information Technology',
    },
    maritalStatus: {
      célébataire: 'Célébataire',
      marié: 'Marié',
    },
    status: {
      active: '启用',
      invited: '客人',
      'empty-permissions': '等待权限',
      inactive: '不活跃',
    },
    invite: '邀请',
    validations: {
      // eslint-disable-next-line
      email: '电子邮件 ${value} 无效',
    },
    title: '用户',
    menu: '用户',
    doAddSuccess: '用户注册成功',
    doUpdateSuccess: '用户注册成功',
    exporterFileName: 'users_export',
    doDestroySuccess: '用户成功删除',
    doDestroyAllSelectedSuccess:
      '用户成功删除',
    edit: {
      title: '编辑用户',
    },
    new: {
      title: '显示用户',
      titleModal: '用户提示',
      emailsHint:
        '使用逗号分隔多个电子邮件地址。',
    },
    view: {
      title: '显示用户',
      activity: '活动',
    },
    importer: {
      title: '导入用户',
      fileName: 'users_import_template',
      hint: 'Les colonnes Fichiers/Images doivent contenir les URL des fichiers séparés par un espace. Relationships must be the ID of the referenced records separated by space. Roles must be the role ids separated by space.',
    },
    errors: {
      userAlreadyExists:
        '使用此电子邮件的用户已存在',
      userNotFound: '找不到用户',
      revokingOwnPermission: `你不能撤销你自己的管理员权限`,
    },
  },

  tenant: {
    name: 'locataire',
    label: 'Workspaces',
    menu: 'Workspaces',
    list: {
      menu: 'Workspaces',
      title: 'Workspaces',
    },
    create: {
      button: 'Create Workspace',
      success: 'Workspace enregistré avec succès',
    },
    update: {
      success: 'Workspace enregistré avec succès',
    },
    destroy: {
      success: 'Workspace supprimer avec succèsd',
    },
    destroyAll: {
      success: 'Workspace(s) supprimer avec succèsd',
    },
    edit: {
      title: 'Edit Workspace',
    },
    fields: {
      id: 'Id',
      name: 'Nom',
      url: 'URL',
      tenantName: 'Workspace Name',
      tenantId: 'Workspace',
      tenantUrl: 'Workspace URL',
      plan: 'PlAnnée',
    },
    enumerators: {},
    new: {
      title: 'Nouvelle Workspace',
    },
    invitation: {
      view: 'Afficher Invitations',
      invited: 'Invited',
      accept: 'Accept Invitation',
      decline: 'Decline Invitation',
      declined: 'Invitation successfully declined',
      acceptWrongEmail: 'Accept Invitation With This Email',
    },
    select: 'Select Workspace',
    validation: {
      url: 'Your workspace URL can only contain lowercase letters, numbers and dashes (and must start with a letter or number).',
    },
  },

  plan: {
    menu: 'Plans',
    title: 'Plans',

    free: {
      label: 'Free',
      price: '$0',
    },
    growth: {
      label: 'Growth',
      price: '$10',
    },
    enterprise: {
      label: 'Enterprise',
      price: '$50',
    },

    pricingPeriod: '/month',
    current: 'Current PlAnnée',
    subscribe: 'Subscribe',
    manage: 'Manage Subscription',
    cancelAtPeriodEnd:
      'This plan will be canceled at the end of the period.',
    somethingWrong:
      'There is something wrong with your subscription. Please go to manage subscription for more details.',
    notPlanUser: `You are not the manager of this subscription.`,
  },

  auditLog: {
    menu: '审计日志',
    title: '审计日志',
    exporterFileName: 'audit_log_export',
    entityNamesHint:
      '使用逗号分隔多个实体。',
    fields: {
      id: '编号',
      timestampRange: '期间',
      entityName: '实体',
      entityNames: '实体',
      entityId: '实体ID',
      action: '行动',
      values: '价值观',
      timestamp: '日期',
      createdByEmail: '用户邮箱',
    },
  },
  settings: {
    title: 'Settings',
    menu: 'Settings',
    save: {
      success:
        'Settings enregistré avec succès. La page se rechargera dans {0} secondes pour que les modifications prennent effet.',
    },
    fields: {
      theme: 'Thème',
      logos: 'Logo',
      backgroundImages: 'Image de fond',
    },
    colors: {
      default: 'Dark',
      light: 'Light',
      cyan: 'CyAnnée',
      'geek-blue': 'Geek Blue',
      gold: 'Gold',
      lime: 'Lime',
      magenta: 'Magenta',
      orange: 'Orange',
      'polar-green': 'Polar Green',
      purple: 'Purple',
      red: 'Red',
      volcano: 'Volcano',
      yellow: 'Yellow',
    },
  },
  dashboard: {
    valider:'提交',
    file: '未選擇文件',
    typecsv: '文件類型無效。 請選擇 CSV 檔案。',
    menu: '用户',
    reset:'重置',
    phone: '上傳號碼',
    check: '檢查號碼',
    labelphone: '寫下電話號碼',
    add: '新增號碼',
    download: '下載範本',
    added: '添加數量',
    duplicated: '數量重複',
    Wrong: '數字錯誤',
    notFound:
      '抱歉，我們找不到您要找的商品。',
    validation: '新增成功的數字',
    Success:  '新增號碼 成功',
    numberValidation: '寫一個有效的數字。 謝謝。',
    message: `This page uses fake data for demonstration purposes only. You can edit it at frontend/view/dashboard/DashboardPage.ts.`,
    charts: {
      day: 'Day',
      red: 'Red',
      green: 'Green',
      yellow: 'Yellow',
      grey: 'Grey',
      blue: 'Blue',
      orange: 'Orange',
      months: {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'Novembre',
        12: 'December',
      },
      eating: 'Eating',
      drinking: 'Drinking',
      sleeping: 'Sleeping',
      designing: 'Designing',
      coding: 'Coding',
      cycling: 'Cycling',
      running: 'Running',
      adherenter: 'adherenter',
      objectif: 'Objectifs par statut',
      projectS: 'Projets par statut ',
      projectT: 'Projets par type',
      adherent: 'Nombre des adhérents ',
      news: 'Nombre des actualités',
      project: 'Nombre des projets ',
      partner: 'Nombre des partenaires',
      nodata: 'aucune donnée à afficher',
    },
  },
  errors: {
    backToHome: '回到家',
    403: `抱歉，您无权访问此页面`,
    404: '对不起，您访问的页面不存在',
    500: '抱歉，服务器报错',
    429: '请求太多。 请稍后再试。',
    forbidden: {
      message: '禁止',
    },
    validation: {
      message: '发生错误',
    },
    defaultErrorMessage: '糟糕，发生错误',
  },

  preview: {
    error:
      '对不起，在预览模式下不允许执行此操作。',
  },

  // See https://github.com/jquense/yup#using-a-adherent-locale-dictionary
  /* eslint-disable */
  validation: {
    mixed: {
      default: '${path} 无效',
      required: '${path} 是必需的',
      oneOf:
        '${path} 必须是以下值之一：${values}',
      notOneOf:
        '${path} 不能是以下值之一：${values}',
      notType: ({ path, type, value, originalValue }) => {
        return `${path} 必须是${type}`;
      },
    },
    string: {
      length:
        '${path} 必须正好是 ${length} 个字符',
      min: '${path} 必须至少为 ${min} 个字符',
      max: '${path} 最多只能有 ${max} 个字符',
      matches:
        '${path} 必须匹配以下内容：“${regex}"',
      email: '${path} 必须是有效的电子邮件',
      url: '${path} 必须是一个有效的 URL',
      trim: '${path} 必须是经过修剪的字符串',
      lowercase:
        '${path} 必须是小写字符串',
      uppercase:
        '${path} 必须是大写字符串',
      selected: '必须选择 ${path}',
    },
    number: {
      min: '${path} 必须大于或等于 ${min}',
      max: '${path} 必须小于或等于 ${max}',
      lessThan: '${path} 必须小于 ${less}',
      moreThan: '${path} 必须大于 ${more}',
      notEqual:
        '${path} 不能等于 ${notEqual}',
      positive: '${path} 必须是正数',
      negative: '${path} 必须是负数',
      integer: '${path} 必须是一个整数',
    },
    date: {
      min: '${path} 字段必须在 ${min} 之后',
      max: '${path} 字段必须在 ${max} 之前',
    },
    boolean: {},
    object: {
      noUnknown:
        '${path} 字段在对象形状中不能有未指定的键',
    },
    array: {
      min: ({ min, path }) =>
        min === 1
          ? `${path} 是必需的`
          : `${path}字段必须至少有 ${min} 个元素`,
      max: '${path} 字段必须小于或等于 ${max} 个元素',
    },
  },
  /* eslint-disable */
  fileUploader: {
    upload: 'Télécharger',
    image: 'Vous devez télécharger une image',
    size: 'Le fichier est trop volumineux. La taille maximale autorisée est{0}',
    formats: `Format invalide. Doit être l'un des suivants :{0}.`,
  },
  importer: {
    line: 'Line',
    status: 'Statut',
    pending: 'En attente',
    imported: 'Importé',
    error: 'Erreur',
    total: `{0} importé, {1} en attente et{2} avec erreur`,
    importedMessage: `Traité {0} of {1}.`,
    noNavigateAwayMessage:
      'Ne quittez pas cette page ou limportation sera arrêtée.',
    completed: {
      success:
        'Importation terminée. Toutes les lignes ont été importées avec succès.',
      someErrors:
        'Traitement terminé, mais certaines lignes nont pas pu être importées.',
      allErrors: 'Import failed. There are no valid rows.',
    },
    form: {
      downloadTemplate: 'Télécharger le modèle',
      hint: 'Cliquez ou faites glisser le fichier dans cette zone pour continuer',
    },
    list: {
      discardConfirm:
        'Es-tu sûr? Les données non importées seront perdues.',
    },
    errors: {
      invalidFileEmpty: 'Le fichier est vide',
      invalidFileExcel:
        'Seuls les fichiers Excel (.xlsx) sont autorisés',
      invalidFileUpload:
        'Fichier non valide. Assurez-vous dutiliser la dernière version du modèle.',
      importHashRequired:
        'Le hachage dimportation est requis',
      importHashExistent:
        'Les données ont déjà été importées',
    },
  },

  autocomplete: {
    loading: '正在加载...',
    noOptions: '没有可用数据',
  },

  imagesViewer: {
    noImage: '无图像',
  },

  table: {
    noData: '没有找到记录',
    loading: '正在加载...',
  },

  pagination: {
    items_per_page: '/ page',
    jump_to: '跳转到',
    jump_to_confirm: '确认',
    page: '',

    prev_page: '上一页',
    next_page: '下一页',
    prev_5: '前 5 页',
    next_5: '下 5 页',
    prev_3: '前 3 页',
    next_3: '下 3 页',
  },
};

export default fr;
