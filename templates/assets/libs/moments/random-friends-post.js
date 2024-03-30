var fdata = {
    apiurl: "https://moments.yzczi.com/",
    defaultFish: 500,
    hungryFish: 500,
}
//可通過 var fdataUser 替換預設值
if (typeof (fdataUser) !== "undefined") {
    for (var key in fdataUser) {
        if (fdataUser[key]) {
            fdata[key] = fdataUser[key];
        }
    }
}
var randomPostTimes = 0;
var randomPostWorking = false;
var randomPostTips = ["釣到了絕世好文！", "在河邊打了個噴嚏，嚇跑了", "你和小伙伴搶奪著", "你擊敗了巨龍，在巢穴中發現了", "挖掘秦始皇墳時找到了", "在路邊閒逛的時候隨手買了一個", "從學校班導師那拿來了孩子上課偷偷看的", "你的同桌無情的從你的語文書中撕下了那篇你最喜歡的", "考古學家近日發現了", "外星人降臨地球學習地球文化，落地時被你塞了", "從圖書館頂層的隱秘角落裡發現了閃著金光的", "徒弟修煉走火入魔，為師立刻掏出了", "在大山中唱山歌，隔壁的阿妹跑來了，帶著", "隔壁家的孩子數學考了滿分，都是因為看了", "隔壁家的孩子英語考了滿分，都是因為看了", "小米研發了全新一代MIX手機，據說靈感", "修煉渡劫成功，還好提前看了", "庫克坐上了蘋果CEO的寶座，因為他面試的時候看了", "阿里巴巴大喊芝麻開門，映入眼簾的就是", "師傅說練武要先煉心，然後讓我好生研讀", "科考隊在南極大陸發現了被冰封的", "飛機窗戶似乎被一張紙糊上了，仔細一看是", "歷史上滿寫的仁義道德四個字，透過字縫裡卻全是", "十幾年前的錄音機似乎還能夠使用，插上電發現正在播的是", "新版語文書擬增加一篇熟讀並背誦的", "經調查，99%的受訪者都沒有背誦過", "今年的大學入學考滿分作文是", "唐僧揭開了佛祖壓在五指山上的", "科學家發現能夠解決衰老的秘密，就是每日研讀", "英特爾發布了全新的至強處理器，其晶片的製造原理都是", "新的iPhone產能很足，新的進貨渠道是", "今年畝產突破了八千萬斤，多虧了", "陸隱一統天上宗，在無數祖境高手的目光下宣讀了", "黑鑽風跟白鑽風說道，吃了唐僧肉能長生不老，他知道是因為看了", "上洗手間沒帶紙，直接提褲跑路也不願意玷汙手中", "種下一篇文章就會產生很多很多文章，我種下了", "三十年河東，三十年河西，莫欺我沒有看過", "踏破鐵血無覓處，得來全靠", "今日雙色球中了兩千萬，預測全靠", "因為卷子上沒寫名字，老師罰抄", "為了抗議世間的不公，割破手指寫下了", "在藝術大街上被貼滿了相同的紙，走近一看是", "這區區迷陣豈能難得住我？其實能走出來多虧了", "今日被一篇文章頂上了微博熱搜，它是", "你送給乞丐一個暴富秘籍，它是", "UZI一個走A拿下五殺，在事後採訪時說他當時回想起了", "科學家解刨了第一個感染喪屍病毒的人，發現喪屍抗體存在於"];
var randomPostClick = 0;

function fetchRandomPost() {
    if (randomPostWorking == false) {
        randomPostWorking = true;
        //獲取旋轉角度
        let randomRotate = randomPostTimes * 360;
        let randomPostTipsItem = randomPostTips[Math.floor(Math.random() * randomPostTips.length)];
        let randomPostLevel = "";
        if (randomPostTimes > 10000) {
            randomPostLevel = "願者上鉤";
        } else if (randomPostTimes > 1000) {
            randomPostLevel = "俯覽天下";
        } else if (randomPostTimes > 1000) {
            randomPostLevel = "超越神了";
        } else if (randomPostTimes > 100) {
            randomPostLevel = "絕世漁夫";
        } else if (randomPostTimes > 75) {
            randomPostLevel = "釣魚王者";
        } else if (randomPostTimes > 50) {
            randomPostLevel = "釣魚宗師";
        } else if (randomPostTimes > 20) {
            randomPostLevel = "釣魚專家";
        } else if (randomPostTimes > 5) {
            randomPostLevel = "釣魚高手";
        } else {
            randomPostLevel = "釣魚新手";
        }
        if (randomPostTimes >= 5) {
            document.getElementById("random-post").innerHTML = `釣魚中... （Lv.` + randomPostTimes + ` 當前稱號：` + randomPostLevel + `）`;
        } else {
            document.getElementById("random-post").innerHTML = `釣魚中...`;
        }

        $(".random-post-start").css("transform", "rotate(" + randomRotate + "deg)")
        window.setTimeout(function () {
            //判斷是否飢餓
            if (((randomPostClick * fdata.hungryFish + fdata.defaultFish) < randomPostTimes) && (Math.round(Math.random()) == 0)) {
                document.getElementById("random-post").innerHTML = "因為只釣魚不吃魚，過分飢餓導致本次釣魚失敗..."
                randomPostWorking = false;
            } else {
                var fetchUrl = fdata.apiurl + 'randompost';
                fetch(fetchUrl)
                    .then(res => res.json())
                    .then(json => {
                        var title = json.title;
                        var link = json.link;
                        var author = json.author;
                        if (document.querySelector('#random-post')) {
                            document.getElementById("random-post").innerHTML = randomPostTipsItem + `來自友鏈 <b>` + author + `</b> 的文章：<a class="random-friends-post" onclick="randomClickLink()" target="_blank" href="` + link + `" rel="external nofollow">` + title + `</a>`;
                        }
                    })
                randomPostWorking = false;
            }
            randomPostTimes += 1;
        }, 2000)
    }
}

fetchRandomPost();

//添加點擊統計
function randomClickLink() {
    randomPostClick += 1;
}