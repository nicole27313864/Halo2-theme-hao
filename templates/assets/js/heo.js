let heo_cookiesTime = null
// 第一次播放音樂
,heo_musicFirst = false
// 音樂播放狀態
,heo_musicPlaying = false
,heo_keyboard = false
,heo_intype = false
,lastSayHello = ""
,refreshNum = 1;
// 私有函數
var heo = {
    // 檢測顯示模式
    darkModeStatus: function () {
        let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        if (theme == 'light') {
            $(".menu-darkmode-text").text("深色模式");
        } else {
            $(".menu-darkmode-text").text("淺色模式");
        }
    },

    // 首頁bb
    initIndexEssay: function() {
        if (document.querySelector("#bber-talk"))
            $(".swiper-wrapper .swiper-slide").each(function () {
                var text = $(this)[0].innerText;
                if (text != 'undefined') {
                    $(this).text(btf.changeContent(text));
                }
            })
            new Swiper(".swiper-container",{
                direction: "vertical",
                loop: !0,
                autoplay: {
                    delay: 3e3,
                    pauseOnMouseEnter: !0
                }
            })
    },


    // 只在首頁顯示
    onlyHome: function () {
        var urlinfo = window.location.pathname;
        urlinfo = decodeURIComponent(urlinfo);
        if (urlinfo == '/') {
            $('.only-home').attr('style', 'display: flex');
        } else {
            $('.only-home').attr('style', 'display: none');
        }
    },

    //是否在首頁
    is_Post: function () {
        var url = window.location.href;  //獲取url
        if (url.indexOf("/archives/") >= 0) { //判斷url地址中是否包含code字串
            return true;
        } else {
            return false;
        }
    },


    //監測是否在頁面開頭
    addNavBackgroundInit: function() {
        var e = 0
            , t = 0;
        document.body && (e = document.body.scrollTop),
        document.documentElement && (t = document.documentElement.scrollTop),
        0 != (e - t > 0 ? e : t) && (document.getElementById("page-header").classList.add("nav-fixed"),
            document.getElementById("page-header").classList.add("nav-visible"),
            $("#cookies-window").hide())
    },

    tagPageActive: function() {
        var e = window.location.pathname;
        if (/\/tags\/.*?/.test(e = decodeURIComponent(e))) {
            var t = e.split("/")[2];
            if (document.querySelector("#tag-page-tags")) {
                $("a").removeClass("select");
                var o = document.getElementById(t);
                o && (o.classList.add("select"),
                    o.style.order = "-1")
            }
        }
    },

    categoriesBarActive: function() {
        document.querySelector("#category-bar") && $(".category-bar-item").removeClass("select");
        var e = window.location.pathname;
        if ("/" == (e = decodeURIComponent(e)))
            document.querySelector("#category-bar") && document.getElementById("category-bar-home").classList.add("select");
        else {
            if (/\/categories\/.*?/.test(e)) {
                var t = e.split("/")[2];
                if (document.querySelector("#category-bar")) {
                    var o = document.getElementById(t);
                    o && (o.classList.add("select"),
                        o.style.order = "-1")
                }
            }
        }
    },

    // 頁尾友鏈
    addFriendLinksInFooter: function () {
        var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
        if(!footerRandomFriendsBtn) return;
        footerRandomFriendsBtn.style.opacity = "0.2";
        footerRandomFriendsBtn.style.transitionDuration = "0.3s";
        footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
        function getLinks(){
            const fetchUrl = "/apis/api.plugin.halo.run/v1alpha1/plugins/PluginLinks/links?keyword=&sort=priority,asc"
            fetch(fetchUrl)
                .then(res => res.json())
                .then(json => {
                    saveToLocal.set('links-data', JSON.stringify(json.items), 10 / (60 * 24))
                    renderer(json.items);
                })
        }
        function renderer(data){
            const linksUrl = GLOBAL_CONFIG.source.links.linksUrl
            const num = GLOBAL_CONFIG.source.links.linksNum
            var randomFriendLinks = getArrayItems(data, num);
            var htmlText = '';
            for (let i = 0; i < randomFriendLinks.length; ++i) {
                var item = randomFriendLinks[i]
                htmlText += `<a class='footer-item' href='${item.spec.url}'  target="_blank" rel="noopener nofollow">${item.spec.displayName}</a>`;
            }
            htmlText += `<a class='footer-item' href='${linksUrl}'>更多</a>`
            if(document.getElementById("friend-links-in-footer")){
                document.getElementById("friend-links-in-footer").innerHTML = htmlText;
            }
        }
        function friendLinksInFooterInit(){
            const data = saveToLocal.get('links-data')
            if (data) {
                renderer(JSON.parse(data))
            } else {
                getLinks()
            }
            setTimeout(()=>{
                footerRandomFriendsBtn.style.opacity = "1";
            }, 300)
        }
        friendLinksInFooterInit();
    },

    //禁止圖片右鍵單擊
    stopImgRightDrag: function () {
        var img = $("img");
        img.on("dragstart", function () {
            return false;
        });
    },

    //置頂文章橫向滾動
    topPostScroll: function () {
        if (document.getElementById("recent-post-top")) {
            let xscroll = document.getElementById("recent-post-top");
            xscroll.addEventListener("mousewheel", function (e) {
                //計算滑鼠滾輪滾動的距離
                let v = -e.wheelDelta / 2;
                xscroll.scrollLeft += v;
                //阻止瀏覽器預設方法
                if (document.body.clientWidth < 1300) {
                    e.preventDefault();
                }
            }, false);
        }
    },

    topCategoriesBarScroll: function () {
        if (document.getElementById("category-bar-items")) {
            let xscroll = document.getElementById("category-bar-items");
            xscroll.addEventListener("mousewheel", function (e) {
                //計算滑鼠滾輪滾動的距離
                let v = -e.wheelDelta / 2;
                xscroll.scrollLeft += v;
                //阻止瀏覽器預設方法
                e.preventDefault();
            }, false);
        }
    },

    //作者卡片問好
    sayhi: function () {
        if (GLOBAL_CONFIG.profileStyle == 'default') {
            if (document.querySelector('#author-info__sayhi')) {
                document.getElementById("author-info__sayhi").innerHTML = getTimeState() + "！我是";
            }
        }else{
            if (document.querySelector('#author-info__sayhi')) {
                document.getElementById("author-info__sayhi").innerHTML = getTimeState();
            }
        }

    },

    // 二維碼
    qrcodeCreate: function () {
        if (document.getElementById('qrcode')) {
            document.getElementById("qrcode").innerHTML = "";
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: window.location.href,
                width: 250,
                height: 250,
                colorDark: "#000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    },

    // 刷新即刻短文瀑布流
    reflashEssayWaterFall: function() {
        document.querySelector("#waterfall") && setTimeout((function() {
                waterfall("#waterfall"),
                    document.getElementById("waterfall") && document.getElementById("waterfall").classList.add("show")
            }
        ), 500)
    },

    // 下載圖片
    downloadImage: function (imgsrc, name) { //下載圖片地址和圖片名
        rm.hideRightMenu();
        if (rm.downloadimging == false) {
            rm.downloadimging = true;
            btf.snackbarShow('正在下載中，請稍後', false, 10000)
            setTimeout(function () {
                let image = new Image();
                // 解決跨域 Canvas 汙染問題
                image.setAttribute("crossOrigin", "anonymous");
                image.onload = function () {
                    let canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);
                    let url = canvas.toDataURL("image/png"); //得到圖片的base64編碼數據
                    let a = document.createElement("a"); // 生成一個a元素
                    let event = new MouseEvent("click"); // 創建一個單擊事件
                    a.download = name || "photo"; // 設置圖片名稱
                    a.href = url; // 將生成的URL設置為a.href屬性
                    a.dispatchEvent(event); // 觸發a的單擊事件
                };
                image.src = imgsrc;
                btf.snackbarShow('圖片已添加盲浮水印，請遵守版權協議');
                rm.downloadimging = false;
            }, "10000");
        } else {
            btf.snackbarShow('有正在進行中的下載，請稍後再試');
        }
    },

    //控制評論彈幕
    switchCommentBarrage: function () {
        let commentBarrage = document.querySelector('.comment-barrage');
        if (commentBarrage) {
            if ($(".comment-barrage").is(":visible")) {
                $(".comment-barrage").hide();
                $(".menu-commentBarrage-text").text("顯示熱評");
                document.querySelector("#consoleCommentBarrage").classList.remove("on");
                localStorage.setItem('commentBarrageSwitch', 'false');
                btf.snackbarShow("✨ 已關閉評論彈幕", false, 2000)
            } else if ($(".comment-barrage").is(":hidden")) {
                $(".comment-barrage").show();
                $(".menu-commentBarrage-text").text("關閉熱評");
                document.querySelector("#consoleCommentBarrage").classList.add("on");
                localStorage.removeItem('commentBarrageSwitch');
                btf.snackbarShow("✨ 已開啟評論彈幕", false, 2000)
            }
        }
        if(GLOBAL_CONFIG.rightMenuEnable){
            rm.hideRightMenu();
        }
    },

    //隱藏cookie窗口
    hidecookie: function() {
        heo_cookiesTime = setTimeout((()=>{
                document.getElementById("cookies-window").classList.add("cw-hide"),
                    setTimeout((()=>{
                            $("#cookies-window").hide()
                        }
                    ), 1e3)
            }
        ), 3e3)
    },

    //隱藏今日推薦
    hideTodayCard: function () {
        if (document.getElementById("todayCard")) {
            document.getElementById("todayCard").classList.add('hide');
        }
    },

    //更改主題色
    changeThemeColor: function (color) {
        if (document.querySelector('meta[name="theme-color"]') !== null) {
            document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
        }
    },

    //自適應主題色
    initThemeColor: function () {
        if (heo.is_Post()) {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            if (currentTop === 0) {
                let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-main');
                heo.changeThemeColor(themeColor);
            } else {
                let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-background');
                heo.changeThemeColor(themeColor);
            }
        } else {
            let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-background');
            heo.changeThemeColor(themeColor);
        }
    },

    //跳轉到指定位置
    jumpTo: function (dom) {
        $(document).ready(function () {
            $("html,body").animate({
                scrollTop: $(dom).eq(i).offset().top
            }, 500 /*scroll實現定位滾動*/); /*讓整個頁面可以滾動*/
        });
    },

    //顯示載入動畫
    showLoading: function () {
        document.querySelector("#loading-box").classList.remove("loaded");
        let cardColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-card-bg');
        heo.changeThemeColor(cardColor);
    },

    //隱藏載入動畫
    hideLoading: function () {
        document.querySelector("#loading-box").classList.add("loaded");
    },

    //切換音樂播放狀態
    musicToggle: function (changePaly = true) {
        const navMusicEl = document.getElementById("nav-music");
        if (!heo_musicFirst) {
            heo.musicBindEvent();
            heo_musicFirst = true;
        }
        let msgPlay = '<i class="haofont hao-icon-play"></i><span>播放音樂</span>';
        let msgPause = '<i class="haofont hao-icon-pause"></i><span>暫停音樂</span>';
        if (heo_musicPlaying) {
            navMusicEl.classList.remove("playing");
            if(GLOBAL_CONFIG.rightMenuEnable){
                document.getElementById("menu-music-toggle").innerHTML = msgPlay;
            }
            document.getElementById("nav-music-hoverTips").innerHTML = "音樂已暫停";
            document.querySelector("#consoleMusic").classList.remove("on");
            heo_musicPlaying = false;
            navMusicEl.classList.remove("stretch");
        } else {
            navMusicEl.classList.add("playing");
            if(GLOBAL_CONFIG.rightMenuEnable){
                document.getElementById("menu-music-toggle").innerHTML = msgPause;
            }
            document.querySelector("#consoleMusic").classList.add("on");
            heo_musicPlaying = true;
            navMusicEl.classList.add("stretch");
        }
        if (changePaly) document.querySelector("#nav-music meting-js").aplayer.toggle();
        if(GLOBAL_CONFIG.rightMenuEnable){
            rm.hideRightMenu();
        }
    },

    // 音樂綁定事件
    musicBindEvent: function () {
        document.querySelector("#nav-music .aplayer-music").addEventListener("click", function () {
            heo.musicTelescopic();
        });
        document.querySelector("#nav-music .aplayer-button").addEventListener("click", function () {
            heo.musicToggle(false);
        });
    },

    // 音樂伸縮
    musicTelescopic: function () {
        const navMusicEl = document.getElementById("nav-music");
        if (navMusicEl.classList.contains("stretch")) {
            navMusicEl.classList.remove("stretch");
        } else {
            navMusicEl.classList.add("stretch");
        }
    },

    //音樂上一曲
    musicSkipBack: function () {
        document.querySelector("meting-js").aplayer.skipBack(),
            rm.hideRightMenu()
    },

    //音樂下一曲
    musicSkipForward: function () {
        document.querySelector("meting-js").aplayer.skipForward(),
            rm.hideRightMenu()
    },

    //獲取音樂中的名稱
    musicGetName: function () {
        for (var e = $(".aplayer-title"), t = [], o = e.length - 1; o >= 0; o--)
            t[o] = e[o].innerText;
        return t[0]
    },


    // 顯示打賞中控台
    rewardShowConsole: function () {
        $('.console-card-group-reward').attr('style', 'display: flex');
        $('.console-card-group').attr('style', 'display: none');
        document.querySelector("#console").classList.add("show");
        heo.initConsoleState()

    },

    //顯示中控台
    showConsole: function () {
        $('.console-card-group-reward').attr('style', 'display: none');
        $('.console-card-group').attr('style', 'display: flex');
        document.querySelector("#console").classList.add("show");


    },

    //隱藏中控台
    hideConsole: function () {
        document.querySelector("#console").classList.remove("show");
    },

    //快捷鍵功能開關
    keyboardToggle: function () {
        if (heo_keyboard) {
            heo_keyboard = false;
            document.querySelector("#consoleKeyboard").classList.remove("on");
            localStorage.setItem('keyboardToggle', 'false');
        } else {
            heo_keyboard = true;
            document.querySelector("#consoleKeyboard").classList.add("on");
            localStorage.setItem('keyboardToggle', 'true');
        }
    },

    //滾動到指定id
    scrollTo: function(e) {
        const t = document.getElementById(e);
        if (t) {
            const e = t.getBoundingClientRect().top + window.pageYOffset - 80
                , o = window.pageYOffset
                , n = e - o;
            let a = null;
            window.requestAnimationFrame((function e(t) {
                    a || (a = t);
                    const l = t - a
                        , i = (c = Math.min(l / 0, 1)) < .5 ? 2 * c * c : (4 - 2 * c) * c - 1;
                    var c;
                    window.scrollTo(0, o + n * i),
                    l < 600 && window.requestAnimationFrame(e)
                }
            ))
        }
    },

    //隱藏側邊欄
    hideAsideBtn: () => { // Hide aside
        const $htmlDom = document.documentElement.classList
        $htmlDom.contains('hide-aside')
            ? saveToLocal.set('aside-status', 'show', 2)
            : saveToLocal.set('aside-status', 'hide', 2)
        $htmlDom.toggle('hide-aside')
        $htmlDom.contains("hide-aside") ? document.querySelector("#consoleHideAside").classList.add("on") : document.querySelector("#consoleHideAside").classList.remove("on")
    },
    toPage: function() {
        var e = document.querySelectorAll(".page-number")
            , t = parseInt(e[e.length - 1].innerHTML)
            , o = document.getElementById("toPageText")
            , n = parseInt(o.value);
        if (!isNaN(n) && n > 0 && "0" !== ("" + n)[0] && n <= t) {
            var url = window.location.href;

            var photosIndexOf = url.indexOf("?group") >= 0 ? url.indexOf("?group") : -1;
            if (photosIndexOf >= 0) {//圖庫頁面
                var new_url = url.substr(0,photosIndexOf);
                var group = url.substr(photosIndexOf)
                var a, l = new_url.replace(/\/page\/\d$/, "");
                a = 1 === n ? l : l + (l.endsWith("/") ? "" : "/") + "page/" + n,
                    document.getElementById("toPageButton").href = a + group
            }else{
                var a, l = url.replace(/\/page\/\d$/, "");
                a = 1 === n ? l : l + (l.endsWith("/") ? "" : "/") + "page/" + n,
                    document.getElementById("toPageButton").href = a
            }
            //首頁有第一屏就跳轉指定位置
            scrollToPost();

        }
    },
    changeSayHelloText: function() {
        const greetings = GLOBAL_CONFIG.helloText.length == 0 ? ["🤖️ 數碼科技愛好者", "🔍 分享與熱心幫助", "🏠 智慧家居小能手", "🔨 設計開發一條龍", "🤝 專修交互與設計", "🏃 腳踏實地行動派", "🧱 團隊小組發動機", "💢 壯漢人狠話不多"] : GLOBAL_CONFIG.helloText
            , authorInfoSayHiElement = document.getElementById("author-info__sayhi");
        // 如果只有一個問候語，設置為預設值
        if (greetings.length === 1) {
            authorInfoSayHiElement.textContent = greetings[0];
            return;
        }
        let randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        for (; randomGreeting === lastSayHello; )
            randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        authorInfoSayHiElement.textContent = randomGreeting,
            lastSayHello = randomGreeting
    },

    //匿名評論
    addRandomCommentInfo: function () {
        // 從形容詞數組中隨機取一個值
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

        // 從蔬菜水果動物名字數組中隨機取一個值
        const randomName = vegetablesAndFruits[Math.floor(Math.random() * vegetablesAndFruits.length)];

        // 將兩個值組合成一個字串
        const name = `${randomAdjective}${randomName}`;

        function dr_js_autofill_commentinfos() {
            var lauthor = [
                    "#author",
                    "input[name='comname']",
                    "#inpName",
                    "input[name='author']",
                    "#ds-dialog-name",
                    "#name",
                    "input[name='nick']",
                    "#comment_author",
                ],
                lmail = [
                    "#mail",
                    "#email",
                    "input[name='commail']",
                    "#inpEmail",
                    "input[name='email']",
                    "#ds-dialog-email",
                    "input[name='mail']",
                    "#comment_email",
                ],
                lurl = [
                    "#url",
                    "input[name='comurl']",
                    "#inpHomePage",
                    "#ds-dialog-url",
                    "input[name='url']",
                    "input[name='website']",
                    "#website",
                    "input[name='link']",
                    "#comment_url",
                ];
            for (var i = 0; i < lauthor.length; i++) {
                var author = document.querySelector(lauthor[i]);
                if (author != null) {
                    author.value = name;
                    author.dispatchEvent(new Event("input"));
                    author.dispatchEvent(new Event("change"));
                    break;
                }
            }
            for (var j = 0; j < lmail.length; j++) {
                var mail = document.querySelector(lmail[j]);
                if (mail != null) {
                    mail.value = visitorMail;
                    mail.dispatchEvent(new Event("input"));
                    mail.dispatchEvent(new Event("change"));
                    break;
                }
            }
            return !1;
        }
        dr_js_autofill_commentinfos();
        var input = document.getElementsByClassName(GLOBAL_CONFIG.source.comments.textarea)[0];
        input.focus();
        input.setSelectionRange(-1, -1);
    },

    //愛發電贊助
    addPowerLinksInPostRightSide: async function() {
        const image = document.getElementById("power-star-image")
            , star = document.getElementById("power-star")
            , title = document.getElementById("power-star-title")
            , desc = document.getElementById("power-star-desc");
        if (image && star && title && desc)
            try {
                const list = GLOBAL_CONFIG.source.power.list
                    , i = heo.getRandomInt(0, list.length)
                    , power = list[i].realNode;
                image.style.backgroundImage = `url(${power.avatar})`,
                    star.href = power.link,
                    title.innerText = power.name,
                    desc.innerText = power.descr
            } catch (e) {}
    },
    getRandomInt: function(e, t) {
        return Math.floor(Math.random() * (t - e)) + e
    },

    //初始化console圖示
    initConsoleState: function() {
        document.documentElement.classList.contains("hide-aside") ? document.querySelector("#consoleHideAside").classList.add("on") : document.querySelector("#consoleHideAside").classList.remove("on")
    },


    // 音樂節目切換背景
    changeMusicBg: function (isChangeBg = true) {
        if (window.location.pathname != "/music") {
            return;
        }
        const anMusicBg = document.getElementById("an_music_bg");

        if (isChangeBg) {
            // player listswitch 會進入此處
            const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
            anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
        } else {
            // 第一次進入，綁定事件，改背景
            let timer = setInterval(() => {
                const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
                // 確保player載入完成
                if (musiccover) {
                    clearInterval(timer);
                    anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
                    // 綁定事件
                    heo.addEventListenerChangeMusicBg();

                    // 暫停nav的音樂
                    if(GLOBAL_CONFIG.navMusicEnable){
                        if (
                            document.querySelector("#nav-music meting-js").aplayer &&
                            !document.querySelector("#nav-music meting-js").aplayer.audio.paused
                        ) {
                            heo.musicToggle();
                        }
                    }
                }
            }, 100);
        }
    },
    addEventListenerChangeMusicBg: function () {
        const anMusicPage = document.getElementById("anMusic-page");
        const aplayerIconMenu = anMusicPage.querySelector(".aplayer-info .aplayer-time .aplayer-icon-menu");

        anMusicPage.querySelector("meting-js").aplayer.on("loadeddata", function () {
            heo.changeMusicBg();
            console.info("player loadeddata");
        });

        aplayerIconMenu.addEventListener("click", function () {
            $(".music-mask").css("display","block")
            $(".music-mask").css("animation","0.5s ease 0s 1 normal none running to_show")
        });
        $(".music-mask").click(function(){
            anMusicPage.querySelector(".aplayer-list").classList.remove("aplayer-list-hide");
            $(".music-mask").hide();
        })
    },

};
const adjectives = ["美麗的", "英俊的", "聰明的", "勇敢的", "可愛的", "慷慨的", "善良的", "可靠的", "開朗的", "成熟的", "穩重的", "真誠的", "幽默的", "豁達的", "有趣的", "活潑的", "優雅的", "敏捷的", "溫柔的", "溫暖的", "敬業的", "細心的", "耐心的", "深沉的", "樸素的", "含蓄的", "率直的", "開放的", "務實的", "堅強的", "自信的", "謙虛的", "文靜的", "深刻的", "純真的", "朝氣蓬勃的", "慎重的", "大方的", "頑強的", "迷人的", "機智的", "善解人意的", "富有想像力的", "有魅力的", "獨立的", "好奇的", "乾淨的", "寬容的", "尊重他人的", "體貼的", "守信的", "有耐性的", "有責任心的", "有擔當的", "有遠見的", "有智慧的", "有眼光的", "有冒險精神的", "有愛心的", "有同情心的", "喜歡思考的", "喜歡學習的", "具有批判性思維的", "善於表達的", "善於溝通的", "善於合作的", "善於領導的", "有激情的", "有幽默感的", "有思想的", "有個性的", "有正義感的", "有責任感的", "有創造力的", "有想像力的", "有藝術細胞的", "有團隊精神的", "有協調能力的", "有決策能力的", "有組織能力的", "有學習能力的", "有執行能力的", "有分析能力的", "有邏輯思維的", "有創新能力的", "有專業素養的", "有商業頭腦的"]
    , vegetablesAndFruits = ["蘿蔔", "白菜", "芹菜", "生菜", "青椒", "辣椒", "茄子", "豆角", "黃瓜", "番茄", "洋蔥", "大蒜", "馬鈴薯", "南瓜", "豆腐", "韭菜", "花菜", "青花菜", "蘑菇", "金針菇", "蘋果", "香蕉", "橙子", "檸檬", "奇異果", "草莓", "葡萄", "桃子", "杏子", "李子", "石榴", "西瓜", "哈密瓜", "蜜瓜", "櫻桃", "藍莓", "柿子", "橄欖", "柚子", "火龍果"];
$(document).ready((function() {
        initBlog()
    }
)),
document.addEventListener("pjax:complete", (function() {
        initBlog();
        // 解決 katex pjax問題
        if((GLOBAL_CONFIG.htmlType == 'post' || GLOBAL_CONFIG.htmlType == 'page') && typeof window.renderKaTex != 'undefined'){
            window.renderKaTex();
        }
     }
));