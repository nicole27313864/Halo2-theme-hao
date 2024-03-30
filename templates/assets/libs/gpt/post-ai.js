(function () {

    // 獲取掛載元素，即文章內容所在的容器元素
    let targetElement = document.querySelector('#post #article-container');
    // 若el配置不存在則自動獲取，如果auto_mount配置為真也自動獲取
    if (!targetElement) {
        return;
    };

    let ai =  GLOBAL_CONFIG.source.postAi.ai;
    let randomNum = GLOBAL_CONFIG.source.postAi.randomNum; //按鈕最大的隨機次數，也就是一篇文章最大隨機出來幾種
    let basicWordCount = GLOBAL_CONFIG.source.postAi.basicWordCount; // 最低獲取字元數, 最小1000, 最大1999
    let btnLink = GLOBAL_CONFIG.source.postAi.btnLink;
    let gptName = GLOBAL_CONFIG.source.postAi.gptName;
    let modeName = GLOBAL_CONFIG.source.postAi.modeName;
    let switchBtn = GLOBAL_CONFIG.source.postAi.switchBtn //# 可以配置是否顯示切換按鈕 以切換tianli/local
    let keys = GLOBAL_CONFIG.source.postAi.keys;
    let Referers = GLOBAL_CONFIG.source.postAi.Referers;

    // let post = document.querySelector('#post')
    // const interface = {
    //     name: "AI-摘要",
    //     aiToggle: "切換",
    //     version: "Tianli GPT",
    //     button: ["介紹自己", "生成本文簡介", "推薦相關文章", "前往首頁"],
    // }
    // // 插入html結構
    // const post_ai_box = document.createElement('div');
    // post_ai_box.className = 'post-ai';
    // post.insertBefore(post_ai_box, post.firstChild);
    //
    // var PostAI = `
    // <div class="ai-title">
    // <i class="haofont hao-icon-bilibili"></i>
    // <div class="ai-title-text">${interface.name}</div>`
    // if (switchBtn) {
    //     PostAI += `<div  id="ai-Toggle">${interface.aiToggle}</div> `;
    // }
    // PostAI += `<i class="haofont hao-icon-arrow-rotate-right"></i> `;
    // if (modeName == 'local') {
    //     PostAI += `<div class="ai-tag" id="ai-tag">${gptName} GPT</div>`;
    // } else {
    //     PostAI += `<div class="ai-tag" id="ai-tag">${interface.version}</div>     `;
    // }
    // PostAI += `
    // </div>
    // <div class="ai-explanation" style="display: block;">AI初始化中...</div>
    // <div class="ai-btn-box">
    //   <div class="ai-btn-item">${interface.button[0]}</div>
    //   <div class="ai-btn-item">${interface.button[1]}</div>
    //   <div class="ai-btn-item">${interface.button[2]}</div>
    //   <div class="ai-btn-item">${interface.button[3]}</div>
    //   <div class="ai-btn-item" id="go-tianli-blog">前往tianli部落格</div>
    // </div>`;
    //
    // post_ai_box.innerHTML = PostAI;

    // 當前隨機到的ai摘要到index
    let lastAiRandomIndex = -1;
    let animationRunning = true; // 標誌變數，控制動畫函數的運行
    // 當前gpt模式
    let mode = modeName
    // 刷新點擊次數
    let refreshNum = 0
    // 記錄上一次傳遞給aiAbstract的參數
    let prevParam;
    const aiTitleRefreshIcon = document.querySelector(".ai-title .haofont.hao-icon-arrow-rotate-right")
    const explanation = document.querySelector(".ai-explanation");
    const post_ai = document.querySelector(".post-ai");
    let ai_str = "";
    let ai_str_length = "";
    let delay_init = 600;
    let i = 0;
    let j = 0;
    let sto = [];
    let elapsed = 0;
    const animate = timestamp => {
        if (!animationRunning) {
            return; // 動畫函數停止運行
        }
        if (!animate.start) animate.start = timestamp;
        elapsed = timestamp - animate.start;
        if (elapsed >= 20) {
            animate.start = timestamp;
            if (i < ai_str_length - 1) {
                let char = ai_str.charAt(i + 1);
                let delay = /[,.，。!?！？]/.test(char) ? 150 : 20;
                if (explanation.firstElementChild) {
                    explanation.removeChild(explanation.firstElementChild);
                }
                explanation.innerHTML += char;
                let div = document.createElement("div");
                div.className = "ai-cursor";
                explanation.appendChild(div);
                i++;
                if (delay === 150) {
                    document.querySelector(".ai-explanation .ai-cursor").style.opacity = "0";
                }
                if (i === ai_str_length - 1) {
                    observer.disconnect(); // 暫停監聽
                    explanation.removeChild(explanation.firstElementChild);
                }
                sto[0] = setTimeout(() => {
                    requestAnimationFrame(animate);
                }, delay);
            }
        } else {
            requestAnimationFrame(animate);
        }
    };
    const observer = new IntersectionObserver(
        entries => {
            let isVisible = entries[0].isIntersecting;
            animationRunning = isVisible; // 標誌變數更新
            if (animationRunning) {
                delay_init = i === 0 ? 200 : 20;
                sto[1] = setTimeout(() => {
                    if (j) {
                        i = 0;
                        j = 0;
                    }
                    if (i === 0) {
                        explanation.innerHTML = ai_str.charAt(0);
                    }
                    requestAnimationFrame(animate);
                }, delay_init);
            }
        },
        { threshold: 0 }
    );
    function clearSTO() {
        if (sto.length) {
            sto.forEach(item => {
                if (item) {
                    clearTimeout(item);
                }
            });
        }
    }
    function startAI(str, df = true) {
        i = 0; //重設計數器
        j = 1;
        clearSTO();
        animationRunning = false;
        elapsed = 0;
        observer.disconnect(); // 暫停上一次監聽
        explanation.innerHTML = df ? "生成中. . ." : "請等待. . .";
        ai_str = str;
        ai_str_length = ai_str.length;
        observer.observe(post_ai); //啟動新監聽
    }

    async function aiAbstract(num = basicWordCount) {
        i = 0; //重設計數器
        j = 1;
        clearSTO();
        animationRunning = false;
        elapsed = 0;
        observer.disconnect(); // 暫停上一次監聽
        if (mode === "tianli") {
            num = Math.max(10, Math.min(2000, num));
            const options = {
                key: keys,
                Referer: Referers
            };

            const truncateDescription = getTitleAndContent(num);
            const requestBody = {
                key: options.key,
                content: truncateDescription,
                url: location.href,
            };
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Referer: options.Referer
                },
                body: JSON.stringify(requestBody),
            };
            try {
                let animationInterval = null
                if (animationInterval) clearInterval(animationInterval);
                animationInterval = setInterval(() => {
                    const animationText = "生成中" + ".".repeat(j);
                    explanation.innerHTML = animationText;
                    j = (j % 3) + 1; // 在 1、2、3 之間循環
                }, 500);
                const response = await fetch(`https://summary.tianli0.top/`, requestOptions);
                let result;
                if (response.status === 403) {
                    result = {
                        summary: "403 refer與key不匹配，本地無法顯示。"
                    }
                } else if (response.status === 500) {
                    result = {
                        summary: "500 系統內部錯誤"
                    }
                } else {
                    result = await response.json();
                }
                const summary = result.summary.trim();
                setTimeout(() => {
                    aiTitleRefreshIcon.style.opacity = "1";
                }, 300)
                if (summary) {
                    startAI(summary);
                } else {
                    startAI("摘要獲取失敗!!!請檢查Tianli服務是否正常!!!");
                }
                clearInterval(animationInterval)

            } catch (error) {
                console.error(error);
                explanation.innerHTML = "發生異常" + error;
            }
        } else {
            const strArr = ai.split(",").map(item => item.trim()); // 將字串轉換為數組，去除每個字串前後的空格
            if (strArr.length !== 1) {
                let randomIndex = Math.floor(Math.random() * strArr.length); // 隨機生成一個索引
                while (randomIndex === lastAiRandomIndex) { // 如果隨機到了上次的索引
                    randomIndex = Math.floor(Math.random() * strArr.length); // 再次隨機
                }
                lastAiRandomIndex = randomIndex; // 更新上次隨機到的索引
                startAI(strArr[randomIndex]);
            } else {
                startAI(strArr[0])
            }
            setTimeout(() => {
                aiTitleRefreshIcon.style.opacity = "1";
            }, 600)
        }
    }

    function aiRecommend() {
        i = 0; //重設計數器
        j = 1;
        clearSTO();
        animationRunning = false;
        elapsed = 0;
        explanation.innerHTML = "生成中. . .";
        ai_str = "";
        ai_str_length = "";
        observer.disconnect(); // 暫停上一次監聽
        sto[2] = setTimeout(() => {
            explanation.innerHTML = recommendList();
        }, 600);
    }
    function aiGoHome() {
        startAI("前往愛發電購買...", false);
        sto[2] = setTimeout(() => {
            pjax.loadUrl("/");
        }, 1000);
    }

    function Introduce() {
        if (mode == "tianli") {
            startAI("我是文章輔助AI: TianliGPT，點擊下方的按鈕，讓我生成本文簡介、推薦相關文章等。")
        } else {
            startAI("我是文章輔助AI: " + gptName + " GPT，點擊下方的按鈕，讓我生成本文簡介、推薦相關文章等。")
        }
    }
    function aiTitleRefreshIconClick() {
        aiTitleRefreshIcon.click()
    }
    const aiBtnList = document.querySelectorAll(".ai-btn-item");
    const aiFunctions = [Introduce, aiTitleRefreshIconClick, aiRecommend, aiGoHome];
    const filteredHeadings = Array.from(aiBtnList).filter(heading => heading.id !== "go-tianli-blog");
    filteredHeadings.forEach((item, index) => {
        item.addEventListener("click", () => {
            aiFunctions[index]();
        });
    });

    function recommendList() {
        let thumbnail = document.querySelectorAll('.relatedPosts-list a');
        var title = document.title;
        let list = '';
        let index = 0;
        if (!thumbnail.length) {
            const cardRecentPost = document.querySelector('.card-widget.card-recent-post');
            if (!cardRecentPost) return '';

            thumbnail = cardRecentPost.querySelectorAll('.aside-list-item a');

            if(thumbnail.length>0){
                thumbnail.forEach(item => {
                    if (item) {
                        if(!title.includes(item.title)){
                            index +=1;
                            list += `<div class="ai-recommend-item"><span class="index">${i + 1}：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${item.title}" data-pjax-state="">${item.title}</a></div>`;
                        }
                    }
                });
            }
            return `很抱歉，無法找到類似的文章，你也可以看看本站最新發布的文章：<br /><div class="ai-recommend">${list}</div>`;
        }
        thumbnail.forEach(item => {
            if (item) {
                if(!title.includes(item.title)){
                    index +=1;
                    list += `<div class="ai-recommend-item"><span>推薦${index}：</span><a href="javascript:;" onclick="pjax.loadUrl('${item.href}')" title="${item.title}" data-pjax-state="">${item.title}</a></div>`;
                }
            }
        });
        return `推薦文章：<br /><div class="ai-recommend">${list}</div>`;
    }


    function changeShowMode() {
        if (mode === "tianli") {
            mode = "local";
            document.getElementById("ai-tag").innerHTML = gptName + " GPT";
            if ((document.getElementById("go-tianli-blog").style.display = "block")) {
                document.querySelectorAll(".ai-btn-item").forEach(item => (item.style.display = "block"));
                document.getElementById("go-tianli-blog").style.display = "none";
            }
            aiAbstract(basicWordCount);
        } else {
            mode = "tianli";
            document.getElementById("ai-tag").innerHTML = "Tianli GPT";

            const truncateDescription = getTitleAndContent(basicWordCount);
            let value = Math.floor(Math.random() * randomNum) + basicWordCount;
            while (value === prevParam || truncateDescription.length - value === prevParam) {
                value = Math.floor(Math.random() * randomNum) + basicWordCount;
            }
            aiTitleRefreshIcon.style.opacity = "0.2";
            aiTitleRefreshIcon.style.transitionDuration = "0.3s";
            aiTitleRefreshIcon.style.transform = "rotate(" + 360 * refreshNum + "deg)";
            if (truncateDescription.length <= 1000) {
                let param = truncateDescription.length - Math.floor(Math.random() * randomNum);
                while (param === prevParam) {
                    param = truncateDescription.length - Math.floor(Math.random() * randomNum);
                }
                aiAbstract(param);
                prevParam = param;
            } else {
                aiAbstract(value);
                prevParam = value;
            }
            refreshNum++;
        }
    }

    //- 監聽tag點擊事件
    document.getElementById("ai-tag").addEventListener("click", () => {
        if (mode === "tianli") {
            document.querySelectorAll(".ai-btn-item").forEach(item => item.style.display = "none");
            document.getElementById("go-tianli-blog").style.display = "block";
            startAI("你好，我是Tianli開發的摘要生成助理TianliGPT，是一個基於GPT-4的生成式AI。我在這裡只負責摘要的預生成和顯示，你無法與我直接溝通，如果你也需要一個這樣的AI摘要介面，可以在下方購買。（暫未開放購買，敬請期待）")
        } else {
            document.getElementById("go-tianli-blog").style.display = "none";
            startAI("你好，我是本站摘要生成助理" + gptName + " GPT，是一個基於GPT-4的生成式AI。我在這裡只負責摘要的預生成和顯示，你無法與我直接溝通。")
        }

    });

    aiTitleRefreshIcon.addEventListener("click", () => {
        const truncateDescription = getTitleAndContent(basicWordCount);
        let value = Math.floor(Math.random() * randomNum) + basicWordCount;
        while (value === prevParam || truncateDescription.length - value === prevParam) {
            value = Math.floor(Math.random() * randomNum) + basicWordCount;
        }
        aiTitleRefreshIcon.style.opacity = "0.2";
        aiTitleRefreshIcon.style.transitionDuration = "0.3s";
        aiTitleRefreshIcon.style.transform = "rotate(" + 360 * refreshNum + "deg)";
        if (truncateDescription.length <= 1000) {
            let param = truncateDescription.length - Math.floor(Math.random() * randomNum);
            while (param === prevParam) {
                param = truncateDescription.length - Math.floor(Math.random() * randomNum);
            }
            aiAbstract(param);
            prevParam = param;
        } else {
            aiAbstract(value);
            prevParam = value;
        }
        showAiBtn();
        refreshNum++;
    });

    document.getElementById("go-tianli-blog").addEventListener("click", () => {
        window.open(btnLink, "_blank");
    });

    if (switchBtn) {
        document.getElementById("ai-Toggle").addEventListener("click", () => {
            changeShowMode()
        });
    }

    function showAiBtn() {
        document.querySelectorAll(".ai-btn-item").forEach(item => {
            if (item.id !== "go-tianli-blog") {
                item.style.display = "block";
            }
            if (item.id === "go-tianli-blog") {
                item.style.display = "none";
            }
        });
    }

    //讀取文章中的所有文本
    function getTitleAndContent(basicWordCount) {
        try {
            const title = document.title;
            const container = document.querySelector('#post #article-container');
            if (!container) {
                console.warn('TianliGPT：找不到文章容器。請嘗試將引入的代碼放入到文章容器之後。如果本身沒有打算使用摘要功能可以忽略此提示。');
                return '';
            }
            const paragraphs = container.getElementsByTagName('p');

            const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
            let content = '';

            for (let h of headings) {
                content += h.innerText + ' ';
            }

            for (let p of paragraphs) {
                // 移除包含'http'的連結
                const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
                content += filteredText;
            }

            const combinedText = title + ' ' + content;
            let wordLimit = 1000;
            if (basicWordCount !== "undefined") {
                wordLimit = basicWordCount;
            }
            const truncatedText = combinedText.slice(0, wordLimit);
            return truncatedText;
        } catch (e) {
            console.error('TianliGPT錯誤：可能由於一個或多個錯誤導致沒有正常運行，原因出在獲取文章容器中的內容失敗，或者可能是在文章轉換過程中失敗。', e);
            return '';
        }
    }

    aiAbstract();
    showAiBtn();
})()