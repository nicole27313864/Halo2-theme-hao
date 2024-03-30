//get請求
$.ajax({
    type: 'get',
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
        key: GLOBAL_CONFIG.source.welcome.key,
        output: 'jsonp',
    },
    dataType: 'jsonp',
    success: function (res) {
        ipLocation = res;
    }
})
window.onload = showWelcome;
// 如果使用了pjax在加上下面這行程式碼
document.addEventListener('pjax:complete', showWelcome);
function getDistance(e1, n1, e2, n2) {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math
    let getPoint = (e, n) => {
        e *= PI / 180
        n *= PI / 180
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }

    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r);
}

function showWelcome() {

    if (ipLocation.status == 0) {
        let dist = getDistance(GLOBAL_CONFIG.source.welcome.locationLng, GLOBAL_CONFIG.source.welcome.locationLat, ipLocation.result.location.lng, ipLocation.result.location.lat); //這裡記得換成自己的經緯度
        let pos = ipLocation.result.ad_info.nation;
        let ip;
        let posdesc;
        //根據國家、省份、城市資訊自訂歡迎語
        switch (ipLocation.result.ad_info.nation) {
            case "日本":
                posdesc = "よろしく，一起去看櫻花嗎";
                break;
            case "美國":
                posdesc = "Let us live in peace!";
                break;
            case "英國":
                posdesc = "想同你一起夜乘倫敦眼";
                break;
            case "俄羅斯":
                posdesc = "做了這瓶伏特加！";
                break;
            case "法國":
                posdesc = "C'est La Vie";
                break;
            case "德國":
                posdesc = "Die Zeit verging im Fluge.";
                break;
            case "澳洲":
                posdesc = "一起去大堡礁吧！";
                break;
            case "加拿大":
                posdesc = "撿起一片楓葉贈予你";
                break;
            case "中國":
                pos = ipLocation.result.ad_info.province + " " + ipLocation.result.ad_info.city + " " + ipLocation.result.ad_info.district;
                ip = ipLocation.result.ip;
                switch (ipLocation.result.ad_info.province) {
                    case "北京市":
                        posdesc = "北——京——歡迎你~~~";
                        break;
                    case "天津市":
                        posdesc = "講段相聲吧";
                        break;
                    case "河北省":
                        posdesc = "山勢巍巍成壁壘，天下雄關鐵馬金戈由此向，無限江山";
                        break;
                    case "山西省":
                        posdesc = "展開坐具長三尺，已占山河五百餘";
                        break;
                    case "內蒙古自治區":
                        posdesc = "天蒼蒼，野茫茫，風吹草低見牛羊";
                        break;
                    case "遼寧省":
                        posdesc = "我想吃烤雞架！";
                        break;
                    case "吉林省":
                        posdesc = "狀元閣就是東北燒烤之王";
                        break;
                    case "黑龍江省":
                        posdesc = "很喜歡哈爾濱大劇院";
                        break;
                    case "上海市":
                        posdesc = "眾所周知，中國只有兩個城市";
                        break;
                    case "江蘇省":
                        switch (ipLocation.result.ad_info.city) {
                            case "南京市":
                                posdesc = "這是我挺想去的城市啦";
                                break;
                            case "蘇州市":
                                posdesc = "上有天堂，下有蘇杭";
                                break;
                            default:
                                posdesc = "散裝是必須要散裝的";
                                break;
                        }
                        break;
                    case "浙江省":
                        posdesc = "東風漸綠西湖柳，雁已還人未南歸";
                        break;
                    case "河南省":
                        switch (ipLocation.result.ad_info.city) {
                            case "鄭州市":
                                posdesc = "豫州之域，天地之中";
                                break;
                            case "南陽市":
                                posdesc = "臣本布衣，躬耕於南陽此南陽非彼南陽！";
                                break;
                            case "駐馬店市":
                                posdesc = "峰峰有奇石，石石挾仙氣嵖岈山的花很美哦！";
                                break;
                            case "開封市":
                                posdesc = "剛正不阿包青天";
                                break;
                            case "洛陽市":
                                posdesc = "洛陽牡丹甲天下";
                                break;
                            default:
                                posdesc = "可否帶我品嘗河南燴麵啦？";
                                break;
                        }
                        break;
                    case "安徽省":
                        posdesc = "蚌埠住了，蕪湖起飛";
                        break;
                    case "福建省":
                        posdesc = "井邑白雲間，岩城遠帶山";
                        break;
                    case "江西省":
                        posdesc = "落霞與孤鶩齊飛，秋水共長天一色";
                        break;
                    case "山東省":
                        posdesc = "遙望齊州九點菸，一泓海水杯中瀉";
                        break;
                    case "湖北省":
                        switch (ipLocation.result.ad_info.city) {
                            case "黃岡市":
                                posdesc = "紅安將軍縣！輩出將才！";
                                break;
                            default:
                                posdesc = "來碗熱乾麵~";
                                break;
                        }
                        break;
                    case "湖南省":
                        posdesc = "74751，長沙斯塔克";
                        break;
                    case "廣東省":
                        switch (ipLocation.result.ad_info.city) {
                            case "廣州市":
                                posdesc = "看小蠻腰，喝早茶了嘛~";
                                break;
                            case "深圳市":
                                posdesc = "今天你逛商場了嘛~";
                                break;
                            case "陽江市":
                                posdesc = "陽春合水！部落客家鄉~ 歡迎來玩~";
                                break;
                            default:
                                posdesc = "來兩斤福建人~";
                                break;
                        }
                        break;
                    case "廣西壯族自治區":
                        posdesc = "桂林山水甲天下";
                        break;
                    case "海南省":
                        posdesc = "朝觀日出逐白浪，夕看雲起收霞光";
                        break;
                    case "四川省":
                        posdesc = "康康川女孩";
                        break;
                    case "貴州省":
                        posdesc = "茅台，學生，再塞200";
                        break;
                    case "雲南省":
                        posdesc = "玉龍飛舞雲纏繞，萬仞冰川直聳天";
                        break;
                    case "西藏自治區":
                        posdesc = "躺在茫茫草原上，仰望藍天";
                        break;
                    case "陝西省":
                        posdesc = "來份臊子麵加饃";
                        break;
                    case "甘肅省":
                        posdesc = "羌笛何須怨楊柳，春風不度玉門關";
                        break;
                    case "青海省":
                        posdesc = "牛肉乾和老優格都好好吃";
                        break;
                    case "寧夏回族自治區":
                        posdesc = "大漠孤煙直，長河落日圓";
                        break;
                    case "新疆維吾爾自治區":
                        posdesc = "駝鈴古道絲綢路，胡馬猶聞唐漢風";
                        break;
                    case "台灣省":
                        posdesc = "我在這頭，大陸在那頭";
                        break;
                    case "香港特別行政區":
                        posdesc = "永定賊有殘留地鬼嚎，迎擊光非歲玉";
                        break;
                    case "澳門特別行政區":
                        posdesc = "性感荷官，線上發牌";
                        break;
                    default:
                        posdesc = "帶我去你的城市逛逛吧！";
                        break;
                }
                break;
            default:
                posdesc = "帶我去你的國家逛逛吧";
                break;
        }

        //根據本地時間切換歡迎語
        let timeChange;
        let date = new Date();
        if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>🌤️ 早安，一日之計在於晨</span>";
        else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>☀️ 午安，記得午休喔~</span>";
        else if (date.getHours() >= 13 && date.getHours() < 17) timeChange = "<span>🕞 午安，飲茶先啦！</span>";
        else if (date.getHours() >= 17 && date.getHours() < 19) timeChange = "<span>🚶‍♂️ 即將下班，記得按時吃飯~</span>";
        else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>🌙 晚安，夜生活嗨起來！</span>";
        else timeChange = "夜深了，早點休息，少熬夜";

        // 新增ipv6顯示為指定內容
        if (ip.includes(":")) {
            ip = "<br>好複雜，咱看不懂~(ipv6)";
        }
        try {
            //自訂文本和需要放的位置
            document.getElementById("welcome-info").innerHTML =
                `歡迎來自 <b><span style="color: var(--hao-ip-color);font-size: var(--hao-gl-size)">${pos}</span></b> 的小友💖<br>${posdesc}🍂<br>當前位置距部落客約 <b><span style="color: var(--hao-ip-color)">${dist}</span></b> 公里！<br>您的IP位址為：<b><span>${ip}</span></b><br>${timeChange} <br>`;
        } catch (err) {
            console.log("Pjax無法獲取元素");
            console.log("如果[側邊欄]設置中沒有給本頁添加 welcome 小部件，請忽略報錯");
        }
    } else {
        try {
            //自訂文本和需要放的位置
            document.getElementById("welcome-info").innerHTML =
                `${ipLocation.message}`;
        } catch (err) {
            console.log("Pjax無法獲取元素")
            console.log("如果[側邊欄]設置中沒有給本頁添加 welcome 小部件，請忽略報錯");
        }

    }


}


