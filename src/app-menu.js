const {Menu, app, clipboard, shell} = require('electron')
const appLogin = require('./app-login')
const string = require('./app-string')
const appMenuPublish = require('./app-menu-publish')
const appUtil = require('./app-util')
const DataStore = require('./app-store')
const dataStore = new DataStore()
const appToast = require('./app-toast')
const appUpdate = require('./app-update')
const appShortcut = require('./app-shortcut')
const picgo = require('./picture/picgo/picgo')

exports.buildContextMenu = function buildContextMenu(tray) {
    // 菜单栏引用
    let menu
    const template = [
        {
            label: '博客',
            submenu: [
                {
                    label: '知乎',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginZhiHu(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.zhihu, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.zhihu, true)
                        }
                    }]
                }
                , {
                    label: '简书',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginJianShu(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.jianshu, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.jianshu, true)
                        }
                    }]
                }
                , {
                    label: '掘金',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginJueJin(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.juejin, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.juejin, true)
                        }
                    }]
                }
                , {
                    label: '思否',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginSegmentFault(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.segmentfault, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.segmentfault, true)
                        }
                    }]
                }
                , {
                    label: 'CSDN',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginCSDN(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.csdn, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.csdn, true)
                        }
                    }]
                }
                , {
                    label: '博客园',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginCnBlog(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.cnblogs, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.cnblogs, true)
                        }
                    }]
                }
                , {
                    label: '开源中国',
                    submenu: [{
                        label: '登录',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginOsChina(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '存稿',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.oschina, false)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.oschina, true)
                        }
                    }]
                }
            ]
        }
        , {
            label: '图床',
            submenu: [
                {
                    label: '新浪',
                    submenu: [
                        {
                            label: '登录',
                            click: function (menuItem, browserWindow, event) {
                                appLogin.loginWebBoPicture(menuItem, browserWindow, event)
                            }
                        }
                        , {
                            label: '启用',
                            id: dataStore.PIC_WEIBO,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_WEIBO),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_WEIBO)
                                appToast.toast({title: '启用成功', body: '正在使用新浪图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '图壳',
                    submenu: [
                        {
                            label: '启用',
                            id: dataStore.PIC_IMGKR,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_IMGKR),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_IMGKR)
                                appToast.toast({title: '启用成功', body: '正在使用图壳图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '七牛云',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_QINIU,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_QINIU),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_QINIU)
                                appToast.toast({title: '启用成功', body: '正在使用七牛云图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '又拍云',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_UPYUN,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_UPYUN),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_UPYUN)
                                appToast.toast({title: '启用成功', body: '正在使用又拍云图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '阿里云',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_ALIYUN,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_ALIYUN),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_ALIYUN)
                                appToast.toast({title: '启用成功', body: '正在使用阿里云图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '腾讯云',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_TCYUN,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_TCYUN),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_TCYUN)
                                appToast.toast({title: '启用成功', body: '正在使用腾讯云图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: 'SM.MS',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_SMMS,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_SMMS),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_SMMS)
                                appToast.toast({title: '启用成功', body: '正在使用SM图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: 'GitHub',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_GITHUB,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_GITHUB),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_GITHUB)
                                appToast.toast({title: '启用成功', body: '正在使用Github图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: 'ImgUR',
                    submenu: [
                        {
                            label: '配置',
                            click: function () {
                                if (!shell.openItem(picgo.configPath)) {
                                    appToast.toast({title: '打开配置文件失败', body: ""})
                                }
                            }
                        },
                        {
                            label: '启用',
                            id: dataStore.PIC_IMGUR,
                            type: 'checkbox',
                            checked: dataStore.isFigureBedSwitch(dataStore.PIC_IMGUR),
                            click: function (menuItem) {
                                menuItem.checked = true
                                dataStore.setFigureBedSwitch(dataStore.PIC_IMGUR)
                                appToast.toast({title: '启用成功', body: '正在使用imgur图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
            ]
        }
        , {
            label: '文章',
            submenu: [
                {
                    label: '本地图片上传',
                    click: function () {
                        appMenuPublish.uploadAllPicture(tray).then()
                    }
                }
                , {
                    label: '网络图片下载',
                    click: function () {
                        appMenuPublish.downloadMdNetPicture(tray).then()
                    }
                }
                , {
                    label: '本地图片整理',
                    click: function () {
                        appMenuPublish.movePictureToFolder(tray)
                    }
                }
                , {
                    label: '整理至新目录',
                    click: function () {
                        appMenuPublish.movePictureAndMdToFolder(tray)
                    }
                }
                , {
                    label: 'Md图片转Img',
                    click: function () {
                        appMenuPublish.pictureMdToImg(tray)
                    }
                }, {
                    label: 'HTML转为Md',
                    click: function () {
                        appMenuPublish.HTMLToMd(tray)
                    }
                }
            ]
        }
        , {
            label: '剪贴板',
            submenu: [
                {
                    label: '图片上传',
                    click: function () {
                        appMenuPublish.uploadClipboardPic(tray)
                    }
                }
                , {
                    label: '代码对齐',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = appUtil.formatCode(oldT)
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: '转纯文字',
                    click: function () {
                        appMenuPublish.coverToText()
                    }
                }, {
                    label: '删除换行',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = oldT.replace(/\n/g, '')
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: '删除空格',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = oldT.replace(/\s+/g, '')
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: 'HTML转Md',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = require('html-to-md')(oldT)
                        appUtil.updateClipboard(newT)
                    }
                }
            ]
        }, {
            label: '快捷键',
            submenu: [
                {
                    label: '图片上传',
                    type: 'checkbox',
                    accelerator: appShortcut.ACCELERATORS[0],
                    checked: dataStore.isUploadClipboardPicSwitch(),
                    click: function (menuItem) {
                        dataStore.setUploadClipboardPicSwitch(menuItem.checked)
                        appShortcut.uploadClipboardPicSwitch(tray, menuItem.checked)
                    }
                },
                {
                    label: '转纯文字',
                    type: 'checkbox',
                    accelerator: appShortcut.ACCELERATORS[1],
                    checked: dataStore.isCoverToTextSwitch(),
                    click: function (menuItem) {
                        dataStore.setCoverToTextSwitch(menuItem.checked)
                        appShortcut.coverToTextSwitch(tray, menuItem.checked)
                    }
                }
            ]
        }
        , {
            type: "separator"
        }
        , {
            label: '关于应用',
            submenu: [
                {
                    label: '官方网站',
                    click: function () {
                        shell.openExternal(require('./app-constant').link).catch()
                    }
                }
                , {
                    label: '我要反馈',
                    click: function () {
                        shell.openExternal(require('./app-constant').issues)
                            .catch()
                    }
                }
                , {
                    label: '给我写信',
                    click: function () {
                        shell.openExternal(require('./app-constant').mail).catch()
                    }
                }
                , {
                    label: '版本查询',
                    click: function () {
                        appToast.toast({title: '当前版本 ' + app.getVersion(), body: ''})
                    }
                }, {
                    label: '检查更新',
                    click: function () {
                        appUpdate.autoUpdateApp(true)
                    }
                }
            ]
        }
        , {
            label: '退出程序',
            click: () => {
                tray.destroy()
                app.quit()
            }
        }
    ]
    menu = Menu.buildFromTemplate(template)
    return menu
}

/**
 * 关闭除ID外的其他checked
 */
function closeMenuChecked(id, menu) {
    for (let pic of dataStore.PIC) {
        if (id !== pic) {
            appUtil.myGetMenuItemById(pic, menu).checked = false
        }
    }
}