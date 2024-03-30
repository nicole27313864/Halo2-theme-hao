// 初始化函數
let rm = {};

//禁止圖片拖拽
rm.stopdragimg = $("img");
rm.stopdragimg.on("dragstart", function () {
    return false;
});

// 顯示菜單
rm.showRightMenu = function (isTrue, x = 0, y = 0) {
    let $rightMenu = $('#rightMenu');
    $rightMenu.css('top', x + 'px').css('left', y + 'px');
    if (isTrue) {
        $rightMenu.show();
        stopMaskScroll()
    } else {
        $rightMenu.hide();
    }
}

// 隱藏菜單
rm.hideRightMenu = function () {
    rm.showRightMenu(false);
    $('#rightmenu-mask').attr('style', 'display: none');
}

// 尺寸
let rmWidth = $('#rightMenu').width();
let rmHeight = $('#rightMenu').height();

// 重新定義尺寸
rm.reloadrmSize = function () {
    rmWidth = $('#rightMenu').width();
    rmHeight = $('#rightMenu').height();
}

// 獲取點擊的href
let domhref = '';
let domImgSrc = '';
let globalEvent = null;

// 監聽右鍵初始化
window.oncontextmenu = function (event) {
    if (document.body.clientWidth > 768) {
        let pageX = event.clientX + 10;	//加10是為了防止顯示時滑鼠遮在菜單上
        let pageY = event.clientY;
        // console.log(event);

        //其他額外菜單
        let $rightMenuOther = $('.rightMenuOther');
        let $rightMenuPlugin = $('.rightMenuPlugin');
        let $rightMenuCopyText = $('#menu-copytext');
        let $rightMenuPasteText = $('#menu-pastetext');
        let $rightMenuCommentText = $('#menu-commenttext');
        let $rightMenuNewWindow = $('#menu-newwindow');
        let $rightMenuNewWindowImg = $('#menu-newwindowimg');
        let $rightMenuCopyLink = $('#menu-copylink');
        let $rightMenuCopyImg = $('#menu-copyimg');
        let $rightMenuDownloadImg = $('#menu-downloadimg');
        let $rightMenuSearch = $('#menu-search');
        let $rightMenuSearchBaidu = $('#menu-searchBaidu');
        let $rightMenuMusicToggle = $('#menu-music-toggle');
        let $rightMenuMusicBack = $('#menu-music-back');
        let $rightMenuMusicForward = $('#menu-music-forward');
        let $rightMenuMusicPlaylist = $('#menu-music-playlist');
        let $rightMenuMusicCopyMusicName = $('#menu-music-copyMusicName');
        let href = event.target.href;
        let imgsrc = event.target.currentSrc;

        // 判斷模式 擴展模式為有事件
        let pluginMode = false;
        $rightMenuOther.show();
        globalEvent = event;

        // 檢查是否需要複製 是否有選中文本
        if (selectTextNow && window.getSelection()) {
            pluginMode = true;
            $rightMenuCopyText.show();
            $rightMenuCommentText.show();
            $rightMenuSearch.show();
            $rightMenuSearchBaidu.show();
        } else {
            $rightMenuCopyText.hide();
            $rightMenuCommentText.hide();
            $rightMenuSearchBaidu.hide();
            $rightMenuSearch.hide();
        }

        //檢查是否右鍵點擊了連結a標籤
        if (href) {
            pluginMode = true;
            $rightMenuNewWindow.show();
            $rightMenuCopyLink.show();
            domhref = href;
        } else {
            $rightMenuNewWindow.hide();
            $rightMenuCopyLink.hide();
        }

        //檢查是否需要複製圖片
        if (imgsrc) {
            pluginMode = true;
            $rightMenuCopyImg.show();
            $rightMenuDownloadImg.show();
            $rightMenuNewWindowImg.show();
            domImgSrc = imgsrc;
        } else {
            $rightMenuCopyImg.hide();
            $rightMenuDownloadImg.hide();
            $rightMenuNewWindowImg.hide();
        }

        // 判斷是否為輸入框
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
            console.log('這是一個輸入框')
            pluginMode = true;
            $rightMenuPasteText.show();
        } else {
            $rightMenuPasteText.hide();
        }

        //判斷是否是音樂
        const navMusicEl = document.querySelector("#nav-music");
        if (navMusicEl && navMusicEl.contains(event.target)) {
            pluginMode = true;
            $rightMenuMusicToggle.show();
            $rightMenuMusicBack.show();
            $rightMenuMusicForward.show();
            $rightMenuMusicPlaylist.show();
            $rightMenuMusicCopyMusicName.show();
        } else {
            $rightMenuMusicToggle.hide();
            $rightMenuMusicBack.hide();
            $rightMenuMusicForward.hide();
            $rightMenuMusicPlaylist.hide();
            $rightMenuMusicCopyMusicName.hide()
        }

        // 如果不是擴展模式則隱藏擴展模組
        if (pluginMode) {
            $rightMenuOther.hide();
            $rightMenuPlugin.show();
        } else {
            $rightMenuPlugin.hide()
        }

        rm.reloadrmSize()

        // 滑鼠默認顯示在滑鼠右下方，當滑鼠靠右或考一下時，將菜單顯示在滑鼠左方\上方
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth + 10;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= pageY + rmHeight - window.innerHeight;
        }

        rm.showRightMenu(true, pageY, pageX);
        $('#rightmenu-mask').attr('style', 'display: flex');
        return false;
    }
};

// 下載圖片狀態
rm.downloadimging = false;

// 複製圖片到剪貼板
rm.writeClipImg = function (imgsrc) {
    console.log('按下複製');
    rm.hideRightMenu();
    btf.snackbarShow('正在下載中，請稍後', false, 10000)
    if (rm.downloadimging == false) {
        rm.downloadimging = true;
        setTimeout(function () {
            copyImage(imgsrc);
            btf.snackbarShow('複製成功！圖片已添加盲浮水印，請遵守版權協議');
            rm.downloadimging = false;
        }, "10000")
    }
}

function imageToBlob(imageURL) {
    const img = new Image;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.crossOrigin = "";
    img.src = imageURL;
    return new Promise(resolve => {
        img.onload = function () {
            c.width = this.naturalWidth;
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            c.toBlob((blob) => {
                // here the image is a blob
                resolve(blob)
            }, "image/png", 0.75);
        };
    })
}

async function copyImage(imageURL) {
    const blob = await imageToBlob(imageURL)
    const item = new ClipboardItem({"image/png": blob});
    navigator.clipboard.write([item]);
}

rm.switchDarkMode = function () {
    navFn.switchDarkMode();
    rm.hideRightMenu();

    //halo.darkComment();
}

rm.copyUrl = function (id) {
    $("body").after("<input id='copyVal'></input>");
    var text = id;
    var input = document.getElementById("copyVal");
    input.value = text;
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("copy");
    $("#copyVal").remove();
}

function stopMaskScroll() {
    if (document.getElementById("rightmenu-mask")) {
        let xscroll = document.getElementById("rightmenu-mask");
        xscroll.addEventListener("mousewheel", function (e) {
            //阻止瀏覽器預設方法
            rm.hideRightMenu();
            // e.preventDefault();
        }, false);
    }
    if (document.getElementById("rightMenu")) {
        let xscroll = document.getElementById("rightMenu");
        xscroll.addEventListener("mousewheel", function (e) {
            //阻止瀏覽器預設方法
            rm.hideRightMenu();
            // e.preventDefault();
        }, false);
    }
}

rm.rightmenuCopyText = function (txt) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(txt);
    }
    rm.hideRightMenu();
}

rm.copyPageUrl = function () {
    var url = window.location.href;
    rm.copyUrl(url);
    btf.snackbarShow('複製本頁連結地址成功', false, 2000);
    rm.hideRightMenu();
}

rm.sharePage = function () {
    var content = window.location.href;
    rm.copyUrl(url);
    btf.snackbarShow('複製本頁連結地址成功', false, 2000);
    rm.hideRightMenu();
}

// 複製當前選中文本
var selectTextNow = '';
document.onmouseup = document.ondbclick = selceText;

function selceText() {
    var txt;
    if (document.selection) {
        txt = document.selection.createRange().text;
    } else {
        txt = window.getSelection() + '';
    }
    if (txt) {
        selectTextNow = txt;
        // console.log(selectTextNow);
    } else {
        selectTextNow = '';
    }
}

// 讀取剪切板
rm.readClipboard = function () {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then(clipText => rm.insertAtCaret(globalEvent.target, clipText));
    }
}

// 黏貼文本到焦點
rm.insertAtCaret = function (elemt, value) {
    const startPos = elemt.selectionStart,
        endPos = elemt.selectionEnd;
    if (document.selection) {
        elemt.focus();
        var sel = document.selection.createRange();
        sel.text = value;
        elemt.focus();
    } else {
        if (startPos || startPos == '0') {
            var scrollTop = elemt.scrollTop;
            elemt.value = elemt.value.substring(0, startPos) + value + elemt.value.substring(endPos, elemt.value.length);
            elemt.focus();
            elemt.selectionStart = startPos + value.length;
            elemt.selectionEnd = startPos + value.length;
            elemt.scrollTop = scrollTop;
        } else {
            elemt.value += value;
            elemt.focus();
        }
    }
}

//黏貼文本
rm.pasteText = function () {
    const result = rm.readClipboard() || '';
    rm.hideRightMenu();
}

//引用到評論
rm.rightMenuCommentText = function (txt) {
    rm.hideRightMenu();
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

// 百度搜索
rm.searchBaidu = function () {
    btf.snackbarShow('即將跳轉到百度搜索', false, 2000);
    setTimeout(function () {
        window.open('https://www.baidu.com/s?wd=' + selectTextNow);
    }, "2000");
    rm.hideRightMenu();
}

//分享連結
rm.copyLink = function () {
    rm.rightmenuCopyText(domhref);
    btf.snackbarShow('已複製連結地址');
}

function addRightMenuClickEvent() {
    // 添加點擊事件
    $('#menu-backward').on('click', function () {
        window.history.back();
        rm.hideRightMenu();
    });
    $('#menu-forward').on('click', function () {
        window.history.forward();
        rm.hideRightMenu();
    });
    $('#menu-refresh').on('click', function () {
        window.location.reload();
    });
    $('#menu-top').on('click', function () {
        btf.scrollToDest(0, 500);
        rm.hideRightMenu();
    });
    $('.menu-link').on('click', rm.hideRightMenu);
    $('#menu-darkmode').on('click', rm.switchDarkMode);
    $('#menu-home').on('click', function () {
        window.location.href = window.location.origin;
    });
    $('#menu-randomPost').on('click', function () {
        toRandomPost()
    });
    $('#menu-commentBarrage').on('click', heo.switchCommentBarrage);
    $('#rightmenu-mask').on('click', rm.hideRightMenu);
    $('#rightmenu-mask').contextmenu(function () {
        rm.hideRightMenu();
        return false;
    });
    $('#menu-translate').on('click', function () {
        rm.hideRightMenu();
    });
    $('#menu-copy').on('click', rm.copyPageUrl);
    $('#menu-pastetext').on('click', rm.pasteText);
    $('#menu-copytext').on('click', function () {
        rm.rightmenuCopyText(selectTextNow);
        btf.snackbarShow('複製成功，複製和轉載請標註本文地址');
    });
    $('#menu-commenttext').on('click', function () {
        rm.rightMenuCommentText(selectTextNow);
    });
    $('#menu-newwindow').on('click', function () {
        window.open(domhref);
        rm.hideRightMenu();
    });
    $('#menu-copylink').on('click', rm.copyLink);
    $('#menu-downloadimg').on('click', function () {
        heo.downloadImage(domImgSrc, 'hao');
    });
    $('#menu-newwindowimg').on('click', function () {
        window.open(domImgSrc, "_blank");
        rm.hideRightMenu();
    });
    $('#menu-copyimg').on('click', function () {
        rm.writeClipImg(domImgSrc);
    });
    $('#menu-searchBaidu').on('click', rm.searchBaidu);
    //音樂
    $('#menu-music-toggle').on('click', heo.musicToggle);
    $('#menu-music-back').on('click', heo.musicSkipBack);
    $('#menu-music-forward').on('click', heo.musicSkipForward);
    $('#menu-music-copyMusicName').on('click', function () {
        rm.rightmenuCopyText(heo.musicGetName());
        btf.snackbarShow('複製歌曲名稱成功', false, 3000);
    });
}
