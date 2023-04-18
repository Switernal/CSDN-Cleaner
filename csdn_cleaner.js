// ==UserScript==
// @name         CSDN净化
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  fuck you csdn!
// @author       Sanders
// @match        *://blog.csdn.net/*
// @match        *://bbs.csdn.net/*
// @icon         https://blog.csdn.net/favicon.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*

Update History

Version：0.6.4
Date：2023-02-09
更新记录：优化目录显示

Version：0.7.0
Date：2023-04-16
更新记录：1.删除创作按钮的动画广告  2.代码免登录复制

*/



(function() {
    'use strict';

    // 背景调成深色，看起来更舒适
    $("body").css("background-color", "dimgray");


    // 删除侧边栏热门文章
    var hotArticle = document.getElementById("asideHotArticle");
    if (hotArticle != null) {
        hotArticle.remove();
    }

    // 右侧的目录
    const content = document.getElementById("groupfile");


    //document.getElementById("asidedirectory"); // 左侧目录，不稳定，窄页面会显示，页面变宽就不显示了
    //document.getElementById("groupfile");      // 右侧目录，稳定，始终会显示


    // 直接删除傻逼左侧边栏
    const sideBar = document.getElementsByClassName("blog_container_aside")[0]
    if (sideBar != null) {
        sideBar.remove();
    }

    // 删除右侧边栏
    const rightSideBar = document.getElementById("rightAside");
    if (rightSideBar != null) {
        rightSideBar.remove();
    }

    if (content != null) {
        // 不设置这个目录不能滚动
        content.setAttribute("style", "overflow: scroll;");
        // 设置高度
        //content.setAttribute("style", "height: fit-content;");

        // 创建一个新的左边栏
        var blogContainerAside = document.createElement("aside");
        // 设置class为左边栏的
        blogContainerAside.setAttribute("class", "blog_container_aside");
        // 位置固定在顶部
        blogContainerAside.setAttribute("style", "position: fixed; top: 56px; left: 5%");
        // 把之前保存的目录塞进新左边栏
        blogContainerAside.appendChild(content);


        // 添加左边栏到mainBox
        document.getElementById("mainBox").appendChild(blogContainerAside);
        // 设置左侧间距, 9%左右刚好能让正文居中，让视觉中心看在正文上，平衡不受左侧目录影响
        document.getElementById("mainBox").setAttribute("style", "margin-left: 8.5%");
        // 取消这个father的居中
        document.getElementsByClassName("main_father")[0].setAttribute("style", "justify-content: start !important");

    }



    // 让文章居中全宽（这个其实不是mainBox, 是mainBox下面的<main>标签）
    var mainBox = document.querySelector('#mainBox>main');
    if (mainBox != null) {

        if (content == null) {
            mainBox.style.float = "none";
            mainBox.style.marginLeft = "12.5%";
        }
        mainBox.style.width = '75%';
        // 浮动在最前，要能压住左侧的目录边栏
        mainBox.style.zIndex = '1';
        mainBox.style.position = 'relative';


        // 调整图片比例
        $("#content_views img").css("max-width", "65%");
        $("#content_views img").css("margin-left", "22.5%");
    }


    // 将底部的作者栏调小
    var bottomBar = document.getElementsByClassName("left-toolbox")[0]
    if (bottomBar != null) {
        bottomBar.style.height = "10px";
    }

    // 边栏移到底部去
    // document.getElementsByClassName("blog_container_aside")[0].style.display = "contents"

    // 删除所有download的链接(仅适用于blog.csdn.net)
    var downloads = document.getElementsByClassName("recommend-item-box type_download");
    // 反着删才管用
    for(var i=downloads.length - 1; i >= 0; i--){
        if (downloads[i] != null) {
            downloads[i].remove();
        }
    }


    // 删除所有download.csdn.net的链接
    setTimeout(function() {

        var downloads2 = document.querySelectorAll("div[data-type=download]");
        for(i=downloads2.length - 1; i >= 0; i--){
            if (downloads2[i] != null) {
                downloads2[i].remove();
            }
        }


        var allLinks = document.getElementsByTagName("a");
        var downloadReg = RegExp(/download.csdn.net/);
        for (i = allLinks.length - 1; i >= 0; i--) {
            const link = allLinks[i].href;
            if (link.match(downloadReg)) {
                // 为了判断是不是导航栏的下载按钮，如果删了会导致导航栏错位，很蠢
                if (allLinks[i].parentElement.title != "获取源码、文档、学习资源") {
                    allLinks[i].remove();
                }
                //allLinks[i].remove();
            }
        }
    }, 1000);


    // 删除学生认证
    // 每1秒检测一次，持续检测10次，有时候网速问题加载会延时
    var studentTime = 0;
    var student = setInterval(deleteStudent, 1000);

    function deleteStudent() {
        var highschool = document.getElementById("csdn-highschool-window");
        if (highschool != null) {
            highschool.remove();
            clearInterval(student);
        }

        if (studentTime == 10) {
            clearInterval(student);
        }
        studentTime++;
    }


    // 针对blink.csdn.net页面调整
    // 调整版面
    $(".blink-main-l").css("width", "70%");
    $(".blink-main-l").css("margin-left", "15%");
    $(".blink-main-l").css("margin-right", "0");
    // 移除右边的个人栏
    $(".blink-main-r").remove();


    // 针对bbs.csdn.net页面调整
    $(".user-right-floor").remove();
    $(".detail-container").css("margin-left", "15%");



    window.onload = function () {

        // 目录高度限制放大一点
        document.getElementsByClassName("groupfile-div")[0].setAttribute("style", "max-height: 500px");

        // 删除顶栏广告
        var adTime = 10;
        var adBar = setInterval(removeAdBar, 1000);
        function removeAdBar() {

            var adBar = document.getElementsByClassName("toolbar-advert")[0];
            if (adBar != null) {
                adBar.remove();
                clearInterval(adBar);
            }
            if (time == 10) {
                clearInterval(adBar);
            }
            time++;

        }


        // 删除其他广告(针对CSDN主页)
        $("[id^=kp_box]").remove();
        $("[class*=advert-box]").remove(); // 会导致顶栏错位

        // 删除学生认证
        var highschool = document.getElementById("csdn-highschool-window");
        if (highschool != null) {
            highschool.remove();
        }

        // 删除右下角的圆形广告
        var toolbar = document.getElementsByClassName("csdn-side-toolbar")[0];
        if (toolbar != null) {
            toolbar.remove();
        }
        var logo_ad = document.getElementsByClassName("csdn-common-logo-advert")[0];
        if (logo_ad != null) {
            logo_ad.remove();
        }

        // 删除Logo
        var logo = document.getElementsByClassName("toolbar-logo")[0];
        if (logo != null) {
            logo.remove();
        }

        // 删除创作按钮的广告
        // 选中按钮下面的a标签
        var writeButtonImage = document.querySelector('.toolbar-btn-write a');
        if (writeButtonImage != null) {
            // 删掉“has-image”的class
            writeButtonImage.className = "";
            // 添加文字
            writeButtonImage.innerText = "创作"
        }


        // 顶部左侧按钮的 height=100% 会错位，移除这个属性就好了
        var tool_bar = document.getElementsByClassName("toolbar-menus")[0];
        if (tool_bar != null) {
            tool_bar.style.height = "auto";
        }


        // 删除vip弹窗广告
        var vip = $(".mask")[0]
        if (vip != null) {
            vip.remove();
        }

        // 删除红包雨
        // 每0.5秒检测一次，持续检测4次，有时候网速问题加载会延时
        var redTime = 0;
        var redPocket = setInterval(deleteRedPocket, 500);
        function deleteRedPocket() {
            var redPocketLayer = document.getElementById("csdn-redpack");
            if (redPocketLayer != null) {
                redPocketLayer.remove();
                clearInterval(redPocket);
            }
            if (redTime == 4) {
                clearInterval(redPocket);
            }
            redTime++;
        }

        // 删除会员组合券广告弹窗
        var buysideTime = 0;
        var buyside = setInterval(deleteBuyside, 500);
        function deleteBuyside() {
            var buysideLayer = document.getElementByClassName("csdn-buyside-entry-box")[0];
            if (buysideLayer != null) {
                buysideLayer.remove();
                clearInterval(buyside);
            }
            if (redTime == 4) {
                clearInterval(buyside);
            }
            buysideTime++;
        }



        // 删除登录弹窗
        // 每1秒检测一次，持续检测10次，有时候网速问题加载会延时
        var time = 0;
        var login = setInterval(deleteLogin, 1000);

        function deleteLogin() {
            var loginWindow = document.getElementsByClassName('passport-login-container')[0];
            if (loginWindow != null) {
                loginWindow.remove();
                clearInterval(login);
            }
            if (time == 10) {
                clearInterval(login);
            }
            time++;
        }


        // 免登录复制
        $(".hljs-button").removeClass("signin");
        $(".hljs-button").attr("data-title", "免登录复制");
        $(".hljs-button").attr(
            "onclick",
            "hljs.copyCode(event);setTimeout(function(){$('.hljs-button').attr('data-title', '免登录复制');},3500);"
        );
        // 去除剪贴板劫持
        $("code").attr("onclick", "mdcp.copyCode(event)");
        try {
            Object.defineProperty(window, "articleType", {
                value: 0,
                writable: false,
                configurable: false,
            });

            csdn.copyright.init("", "", "");
        } catch (err) {}

    };
})();
