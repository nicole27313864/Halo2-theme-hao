function checkOpen() {
}

checkOpen.toString = function () {
    this.opened = true;
};

//封面純色
function coverColor() {
    var path = document.getElementById("post-cover")?.src;
    // console.log(path);
    if (path !== undefined) {

        // 獲取顏色 https://github.com/fast-average-color/fast-average-color
        const fac = new FastAverageColor();

        fac.getColorAsync(path, {
            // 忽略白色
            ignoredColor: [255, 255, 255, 255]
        })
            .then(color => {
                /**
                 * 獲取數據後的處理程序
                 */
                var value = color.hex;
                // console.log(value);
                // document.getElementById('page-header').style.backgroundColor=value;
                // document.styleSheets[0].addRule('#page-header:before','background: '+ value +'!important');

                if (getContrastYIQ(value) === "light") {
                    value = LightenDarkenColor(colorHex(value), -40)
                }

                const style = document.createElement('style');
                document.head.appendChild(style);
                const styleSheet = style.sheet;
                styleSheet.insertRule(`:root{--heo-main: ${value}!important}`, styleSheet.cssRules.length);
                styleSheet.insertRule(`:root{--heo-main-op: ${value}23!important}`, styleSheet.cssRules.length);
                styleSheet.insertRule(`:root{--heo-main-op-deep: ${value}dd!important}`, styleSheet.cssRules.length);
                styleSheet.insertRule(`:root{--heo-main-none: ${value}00!important}`, styleSheet.cssRules.length);
                heo.initThemeColor()
                document.getElementById("coverdiv").classList.add("loaded");
            })
            .catch(e => {
                console.log(e);
            });

    } else {
        // document.styleSheets[0].addRule('#page-header:before','background: none!important');
        const style = document.createElement('style');
        document.head.appendChild(style);
        const styleSheet = style.sheet;
        styleSheet.insertRule(`:root{--heo-main: var(--heo-theme)!important}`, styleSheet.cssRules.length);
        styleSheet.insertRule(`:root{--heo-main-op: var(--heo-theme-op)!important}`, styleSheet.cssRules.length);
        styleSheet.insertRule(`:root{--heo-main-op-deep:var(--heo-theme-op-deep)!important}`, styleSheet.cssRules.length);
        styleSheet.insertRule(`:root{--heo-main-none: var(--heo-theme-none)!important}`, styleSheet.cssRules.length);
        heo.initThemeColor()
    }
}

//RGB顏色轉化為16進位制顏色
function colorHex(str) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var that = str;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
}

//16進位制顏色轉化為RGB顏色
function colorRgb(str) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = str.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //處理六位的顏色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "rgb(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
}

//變暗變亮主方法
function LightenDarkenColor(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;


    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}

//判斷是否為亮色
function getContrastYIQ(hexcolor) {
    var colorrgb = colorRgb(hexcolor);
    var colors = colorrgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var red = colors[1];
    var green = colors[2];
    var blue = colors[3];
    var brightness;
    brightness = (red * 299) + (green * 587) + (blue * 114);
    brightness = brightness / 255000;
    if (brightness >= 0.5) {
        return "light";
    } else {
        return "dark";
    }
}

window.onload = function () {
    var copybtnlist = document.getElementsByClassName("copybtn")
    for (var i = 0; i < copybtnlist.length; i++) {
        document.getElementsByClassName("copybtn")[i].addEventListener("click", function () {
            showcopy();
        });
    }
    heo.initThemeColor();
}

function showcopy() {
    if (GLOBAL_CONFIG.Snackbar !== undefined) {
        btf.snackbarShow(GLOBAL_CONFIG.copy.success)
    } else {
        const prevEle = ctx.previousElementSibling
        prevEle.innerText = GLOBAL_CONFIG.copy.success
        prevEle.style.opacity = 1
        setTimeout(() => {
            prevEle.style.opacity = 0
        }, 700)
    }
}

// 早安問好
// 獲取時間
var getTimeState = () => {

        if (GLOBAL_CONFIG.profileStyle == 'default') {
            // 獲取當前時間
            var timeNow = new Date();
            // 獲取當前小時
            var hours = timeNow.getHours();
            // 設置默認文字
            var text = ``;
            // 判斷當前時間段
            if (hours >= 0 && hours <= 5) {
                text = `晚安`;
            } else if (hours > 5 && hours <= 10) {
                text = `早安`;
            } else if (hours > 10 && hours <= 14) {
                text = `午安`;
            } else if (hours > 14 && hours <= 18) {
                text = `午安`;
            } else if (hours > 18 && hours <= 24) {
                text = `晚安`;
            }
            // 返回當前時間段對應的狀態
            return text;

        }

        if (GLOBAL_CONFIG.profileStyle == 'one') {
            var e = (new Date).getHours()
                , t = "";
            return e >= 0 && e <= 5 ? t = "睡個好覺，保證精力充沛" : e > 5 && e <= 10 ? t = "一日之計在於晨" : e > 10 && e <= 14 ? t = "吃飽了才有力氣做事" : e > 14 && e <= 18 ? t = "集中精力，攻克難關" : e > 18 && e <= 24 && (t = "不要太勞累了，早睡更健康"),
                t
        }

    },
//深色模式切換
    switchDarkMode = () => {
        "dark" === document.documentElement.getAttribute("data-theme") ? (activateLightMode(),
            saveToLocal.set("theme", "light", 2),
        void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day, false, 2000),
            $(".menu-darkmode-text").text("深色模式")) : (activateDarkMode(),
            saveToLocal.set("theme", "dark", 2),
        void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night, false, 2000),
            $(".menu-darkmode-text").text("淺色模式")),
            handleCases()
        heo.darkModeStatus();
        //代碼塊
        if (GLOBAL_CONFIG.prism.enable) {
            halo.dataCodeTheme();
        }
    }
    , handleCases = () => {
        "function" == typeof utterancesTheme && utterancesTheme(),
        "object" == typeof FB && window.loadFBComment(),
        window.DISQUS && document.getElementById("disqus_thread").children.length && setTimeout((() => window.disqusReset()), 200)
    }
    , navFn = {
        switchDarkMode: switchDarkMode
    };

//引用到評論
function rightMenuCommentText(txt) {
    if (GLOBAL_CONFIG.rightMenuEnable) {
        rm.hideRightMenu();
    }
    var input = document.getElementsByClassName(GLOBAL_CONFIG.source.comments.textarea)[0];
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    let inputValue = replaceAll(txt, '\n', '\n> ')
    input.value = '> ' + inputValue + '\n\n';
    input.dispatchEvent(evt);
    var domTop = document.querySelector("#post-comment").offsetTop;
    window.scrollTo(0, domTop - 80);
    input.focus();
    input.setSelectionRange(-1, -1);
    if (document.getElementById("comment-tips")) {
        document.getElementById("comment-tips").classList.add("show");
    }
}

//替換所有內容
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

// 移除讚賞遮色片
function RemoveRewardMask() {
    if (!document.querySelector(".reward-main")) return;
    document.querySelector(".reward-main").style.display = "none";
    document.getElementById("quit-box").style.display = "none";
}

//添加讚賞遮色片
function AddRewardMask() {
    if (!document.querySelector(".reward-main")) return;
    document.querySelector(".reward-main").style.display = "flex";
    document.getElementById("quit-box").style.display = "flex";
}

//監聽遮色片關閉
document.addEventListener('touchstart', e => {
    RemoveRewardMask()
}, false)

//監聽ctrl+C
$(document).unbind('keydown').bind('keydown', function (e) {
    if (GLOBAL_CONFIG.rightMenuEnable) {
        if ((e.ctrlKey || e.metaKey) && (e.keyCode == 67) && (selectTextNow != '')) {
            btf.snackbarShow('複製成功，複製和轉載請標註本文地址');
            rm.rightmenuCopyText(selectTextNow);
            return false;
        }
    } else {

    }
})

//顏色
document.addEventListener('scroll', btf.throttle(function () {
    heo.initThemeColor()
}, 200))

//友鏈隨機傳送
function travelling() {
    function getLinks() {
        const links = "/apis/api.plugin.halo.run/v1alpha1/plugins/PluginLinks/links?keyword=&sort=priority,asc"
        fetch(links)
            .then(res => res.json())
            .then(json => {
                saveToLocal.set('links-data', JSON.stringify(json.items), 10 / (60 * 24))
                renderer(json.items);
            })
    }

    function renderer(data) {
        var linksData = data
        var name = ''
        var link = ''
        if (linksData.length > 0) {
            var randomFriendLinks = getArrayItems(linksData, 1);
            name = randomFriendLinks[0].spec.displayName;
            link = randomFriendLinks[0].spec.url;
        }
        var msg = "點擊前往按鈕進入隨機一個友鏈，不保證跳轉網站的安全性和可用性。本次隨機到的是本站友鏈：「" + name + "」";
        const style = document.createElement('style');
        document.head.appendChild(style);
        const styleSheet = style.sheet;
        styleSheet.insertRule(`:root{--heo-snackbar-time: 8000ms!important}`, styleSheet.cssRules.length);
        Snackbar.show({
            text: msg,
            duration: 8000,
            pos: 'top-center',
            actionText: '前往',
            onActionClick: function (element) {
                $(element).css('opacity', 0);
                window.open(link, '_blank');
            }
        });
    }

    function init() {
        const data = saveToLocal.get('links-data')
        if (data) {
            renderer(JSON.parse(data))
        } else {
            getLinks()
        }
    }

    init()
}

//前往黑洞
function toforeverblog() {
    var msg = "點擊前往按鈕進入「十年之約」項目中的成員部落格，不保證跳轉網站的安全性和可用性";
    Snackbar.show({
        text: msg,
        duration: 8000,
        pos: 'top-center',
        actionText: '前往',
        onActionClick: function (element) {
            //Set opacity of element to 0 to close Snackbar
            $(element).css('opacity', 0);
            window.open(link, 'https://www.foreverblog.cn/go.html');
        }
    });
}

//前往開往項目
function totraveling() {
    btf.snackbarShow("即將跳轉到「開往」項目的成員部落格，不保證跳轉網站的安全性和可用性", function (element) {
        element.style.opacity = 0,
        travellingsTimer && clearTimeout(travellingsTimer)
    }, 5000, "取消"),
        travellingsTimer = setTimeout(function () {
            window.open("https://www.travellings.cn/go.html", "_blank")
        }, "5000")
}

// 移除載入動畫
function removeLoading() {
    setTimeout(function () {
        preloader.endLoading();
    }, 3000)
}

function addFriendLink() {
    var input = document.getElementsByClassName(GLOBAL_CONFIG.source.comments.textarea)[0];
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    input.value = '暱稱（請勿包含部落格等字樣）：\n網站地址（要求部落格地址，請勿提交個人首頁）：\n頭像圖片url（請提供盡可能清晰的圖片，我會上傳到我自己的圖床）：\n描述：\n';
    input.dispatchEvent(evt);
    heo.scrollTo("#post-comment");
    input.focus();
    input.setSelectionRange(-1, -1);
}

//從一個給定的數組arr中,隨機返回num個不重複項
function getArrayItems(arr, num) {
    //新建一個數組,將傳入的數組複製過來,用於運算,而不要直接操作傳入的數組;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的數值項,保存在此數組
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        //判斷如果數組還有可以取出的元素,以防下標越界
        if (temp_array.length > 0) {
            //在數組中產生一個隨機索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //將此隨機索引的對應的數組元素值複製出來
            return_array[i] = temp_array[arrIndex];
            //然後刪掉此索引的數組元素,這時候temp_array變為新的數組
            temp_array.splice(arrIndex, 1);
        } else {
            //數組中數據項取完後,退出循環,比如數組本來只有10項,但要求取出20項.
            break;
        }
    }
    return return_array;
}

//評論增加放大功能
function owoBig() {
    new MutationObserver((e => {
            for (let t of e)
                if ("childList" === t.type)
                    for (let e of t.addedNodes)
                        if (e.classList && e.classList.contains("OwO-body")) {
                            let t = e
                                , o = ""
                                , n = !0
                                , a = document.createElement("div");
                            a.id = "owo-big",
                                document.querySelector("body").appendChild(a),
                                t.addEventListener("contextmenu", (e => e.preventDefault())),
                                t.addEventListener("mouseover", (e => {
                                        "LI" === e.target.tagName && n && (n = !1,
                                            o = setTimeout((() => {
                                                    let t = 3 * e.target.clientWidth
                                                        , o = e.x - e.offsetX - (t - e.target.clientWidth) / 2
                                                        , n = e.y - e.offsetY;
                                                    a.style.height = 3 * e.target.clientHeight + "px",
                                                        a.style.width = t + "px",
                                                        a.style.left = o + "px",
                                                        a.style.top = n + "px",
                                                        a.style.display = "flex",
                                                        a.innerHTML = `<img src="${e.target.querySelector("img").src}">`
                                                }
                                            ), 300))
                                    }
                                )),
                                t.addEventListener("mouseout", (e => {
                                        a.style.display = "none",
                                            n = !0,
                                            clearTimeout(o)
                                    }
                                ))
                        }
        }
    )).observe(document.getElementById("post-comment"), {
        childList: !0,
        subtree: !0
    })
}

// 檢測按鍵
window.onkeydown = function (e) {
    if (e.keyCode === 123) {
        btf.snackbarShow('開發者模式已打開，請遵循GPL協議', false, 3000)
    }
}

// 阻止搜索滾動
// document.querySelector('#algolia-search').addEventListener('wheel', (e) => {
//   e.preventDefault()
// })
document.querySelector('#console') && document.querySelector('#console').addEventListener('wheel', (e) => {
    e.preventDefault()
})
// document.querySelector('#loading-box').addEventListener('wheel', (e) => {
//   e.preventDefault()
// })

//自動調整即刻短文尺寸
window.addEventListener("resize", (function () {
        document.querySelector("#waterfall") && heo.reflashEssayWaterFall()
    }
));

//首頁大卡片恢復顯示
$(".topGroup").hover(function () {
    // console.log("卡片懸浮");
}, function () {
    hoverOnCommentBarrage = false;

    if (document.getElementById("todayCard")) {
        document.getElementById("todayCard").classList.remove('hide');
        document.getElementById('todayCard').style.zIndex = 1;
        // console.log("卡片停止懸浮");
    }
});


function initObserver() {
    var e = document.getElementById("post-comment")
        , t = document.getElementById("pagination");
    e && new IntersectionObserver((function (e) {
            e.forEach((function (e) {
                    e.isIntersecting ? (t && t.classList.add("show-window"),
                        document.querySelector(".comment-barrage").style.bottom = "-200px") : (t && t.classList.remove("show-window"),
                        document.querySelector(".comment-barrage").style.bottom = "0px")
                }
            ))
        }
    )).observe(e)
}

// 頁面百分比
function percent() {
    let e = document.documentElement.scrollTop || window.pageYOffset
        ,
        t = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight
        , o = Math.round(e / t * 100)
        , n = document.querySelector("#percent");
    var a = window.scrollY + document.documentElement.clientHeight
        , i = document.getElementById("post-comment") || document.getElementById("footer");
    i.offsetTop + i.offsetHeight / 2 < a || o > 90 ? (document.querySelector("#nav-totop").classList.add("long"),
        n.innerHTML = "返回頂部") : (document.querySelector("#nav-totop").classList.remove("long"),
    o >= 0 && (n.innerHTML = o)),
        endresult = t - e,
        endresult < 100 ? $(".needEndHide").addClass("hide") : $(".needEndHide").removeClass("hide"),
        window.onscroll = percent
}

// 首頁分頁隱藏置頂內容
function checkUrlAndAddHideBanner() {
    var e = window.location.href;
    if (/\/page\//.test(e)) {
        var t = document.getElementById("recent-top-post-group")
            , o = document.getElementById("bbTimeList")
            , c = document.getElementById("climb");
        t && (t.classList.add("more-page"),
        o && o.classList.add("more-page"),
        c && c.classList.add("more-page"));
    }
}

function setBodyDataType() {
    var body = document.body;
    var att = document.createAttribute("data-type");
    att.value = GLOBAL_CONFIG.htmlType;
    body.setAttributeNode(att);
}

function listenToPageInputPress() {
    var e = document.getElementById("toPageText")
        , t = document.getElementById("toPageButton");
    e && (e.addEventListener("keydown", (e => {
            13 === e.keyCode && (heo.toPage(),
                pjax.loadUrl(t.href))
        }
    )),
        e.addEventListener("input", (function () {
                "" === e.value || "0" === e.value ? t.classList.remove("haveValue") : t.classList.add("haveValue");
                var o = document.querySelectorAll(".page-number")
                    , n = +o[o.length - 1].innerHTML;
                +document.getElementById("toPageText").value > n && (e.value = n)
            }
        )))
}

function initBlog() {
    // 圖片主色
    GLOBAL_CONFIG.source.post.dynamicBackground && coverColor(),
    GLOBAL_CONFIG.rightMenuEnable && addRightMenuClickEvent(),
        percent(),
        listenToPageInputPress(),
        setBodyDataType(),
        heo.topPostScroll(),
        heo.sayhi(),
        heo.stopImgRightDrag(),
        heo.addPowerLinksInPostRightSide(),
        heo.qrcodeCreate(),
        //右下角 snackbar 跳出視窗
    GLOBAL_CONFIG.source.tool.switch && heo.hidecookie(),
        heo.onlyHome(),
        heo.addNavBackgroundInit(),
        heo.initIndexEssay(),
        heo.reflashEssayWaterFall(),
        heo.darkModeStatus(),
        heo.categoriesBarActive(),
        heo.initThemeColor(),
        heo.topCategoriesBarScroll(),
        //隱藏載入動畫
    GLOBAL_CONFIG.loadingBox && heo.hideLoading(),
        heo.tagPageActive(),
        initObserver(),
        checkUrlAndAddHideBanner(),
        halo.getTopSponsors(),
        halo.checkAd()


}

// 如果當前頁有評論就執行函數
document.getElementById("post-comment") && owoBig()

//檢查是否開啟快捷鍵
// if (localStorage.getItem('keyboardToggle') !== 'false') {
//     document.querySelector("#consoleKeyboard").classList.add("on");
// } else {
//     document.querySelector("#consoleKeyboard").classList.remove("on");
// }

//響應esc鍵
$(window).on('keydown', function (ev) {

    // Escape
    if (ev.keyCode == 27) {
        heo.hideLoading();
        heo.hideConsole();
        rm.hideRightMenu();
    }

    if (heo_keyboard && ev.shiftKey && !heo_intype) {

        // 顯示快捷鍵面板 shift鍵
        // if (ev.keyCode == 16) {
        //     document.querySelector("#keyboard-tips").classList.add("show");
        // }

        //關閉快捷鍵 shift+K
        if (ev.keyCode == 75) {
            heo.keyboardToggle();
            return false;
        }

        //響應打開控制台鍵 shift+A
        if (ev.keyCode == 65) {
            heo.showConsole();
            return false;
        }

        //音樂控制 shift+M
        if (ev.keyCode == 77) {
            heo.musicToggle();
            return false;
        }

        //隨機文章 shift+R
        if (ev.keyCode == 82) {
            toRandomPost();
            return false;
        }

        //回到首頁 shift+H
        if (ev.keyCode == 72) {
            pjax.loadUrl("/");
            return false;
        }

        //深色模式 shift+D
        if (ev.keyCode == 68) {
            rm.switchDarkMode();
            return false;
        }

        //友鏈魚塘 shift+F
        if (ev.keyCode == 70) {
            pjax.loadUrl("/moments/");
            return false;
        }

        //友情連結頁面 shift+L
        if (ev.keyCode == 76) {
            pjax.loadUrl("/link/");
            return false;
        }

        //關於本站 shift+P
        if (ev.keyCode == 80) {
            pjax.loadUrl("/about/");
            return false;
        }

        //線上工具 shift+T
        if (ev.keyCode == 84) {
            pjax.loadUrl("/tlink/");
            return false;
        }

    }

});

// $(window).on('keyup', function (ev) {
//     // 顯示快捷鍵面板
//     if (ev.keyCode == 16) {
//         document.querySelector("#keyboard-tips").classList.remove("show");
//     }
// });

//輸入狀態檢測
$("input").focus(function () {
    heo_intype = true;
});
$("textarea").focus(function () {
    heo_intype = true;
});
$("input").focusout(function () {
    heo_intype = false;
});
$("textarea").focusout(function () {
    heo_intype = false;
});

//老舊瀏覽器檢測
function browserTC() {
    btf.snackbarShow("");
    Snackbar.show({
        text: '為了保護訪客訪問安全，本站已停止對你正在使用的過低版本瀏覽器的支持',
        actionText: '關閉',
        duration: '6000',
        pos: 'bottom-right'
    });
}

function browserVersion() {
    var userAgent = navigator.userAgent;
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
    var isFirefox = userAgent.indexOf("Firefox") > -1;
    var isOpera = userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1;
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Edge") == -1 && userAgent.indexOf("OPR") == -1;
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Edge") == -1 && userAgent.indexOf("OPR") == -1;
    if (isEdge) {
        if (userAgent.split('Edge/')[1].split('.')[0] < 90) {
            browserTC()
        }
    } else if (isFirefox) {
        if (userAgent.split('Firefox/')[1].split('.')[0] < 90) {
            browserTC()
        }
    } else if (isOpera) {
        if (userAgent.split('OPR/')[1].split('.')[0] < 80) {
            browserTC()
        }
    } else if (isChrome) {
        if (userAgent.split('Chrome/')[1].split('.')[0] < 90) {
            browserTC()
        }
    } else if (isSafari) {
        //不知道Safari多少版本才算老舊
    }
}

function setCookies(obj, limitTime) {
    let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toUTCString()
    for (let i in obj) {
        document.cookie = i + '=' + obj[i] + ';expires=' + data
    }
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

if (getCookie('browsertc') != 1) {
    setCookies({
        browsertc: 1,
    }, 1); //設置cookie快取一天，即一天彈一次
    browserVersion();
}

//當前窗口得到焦點 
// window.onfocus = function () {
//     document.querySelector("#keyboard-tips").classList.remove("show");
// };

//注入函數
document.addEventListener('pjax:click', function () {
    //顯示載入進度條
    if (GLOBAL_CONFIG.loadProgressBar) {
        Pace.restart();
    }
    //顯示載入動畫
    if (GLOBAL_CONFIG.loadingBox) {
        heo.showLoading();
    }
})
