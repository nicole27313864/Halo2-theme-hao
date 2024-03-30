let heoGPTIsRunning = !1,
    heo_aiPostExplanation = "",
    siteTitle = GLOBAL_CONFIG.siteTitle,
    gptName = GLOBAL_CONFIG.source.postAi.gptName,
    keys = GLOBAL_CONFIG.source.postAi.keys,
    heoGPTModel = `${gptName}GPT`,
    aiTalkMode = !1;
var heoGPT = {
    aiExplanation: async function() {
        const e = document.querySelector(".ai-explanation");
        if (!e) return;
        "" === heo_aiPostExplanation && (heo_aiPostExplanation = e.innerText);
        const o = heoGPT.synonymReplace(heo_aiPostExplanation);
        heoGPT.aiShowAnimation(Promise.resolve(o))
    },
    loadHeogpt: async function() {
        if (null === heogpt) {
            const e = await fetch("/themes/theme-hao/assets/libs/gpt/heogpt.json");
            heogpt = await e.json()
        }
    },
    getTitleAndContent: function() {
        const e = document.title,
            o = document.getElementById("article-container"),
            n = o.getElementsByTagName("p"),
            t = o.querySelectorAll("h1, h2, h3, h4, h5");
        let i = "";
        for (let e of t) i += e.innerText + " ";
        for (let e of n) {
            i += e.innerText.replace(/https?:\/\/[^\s]+/g, "")
        }
        const a = (e + " " + i).slice(0, 1e3);
        return console.log("heo的:" + a), a
    },
    fetchTianliGPT: async function(e, o) {
        const n = `https://summary.tianli0.top/?content=${encodeURIComponent(e)}&key=${encodeURIComponent(o)}`;
        try {
            const e = new AbortController,
                o = await fetch(n, {
                    signal: e.signal
                });
            if (o.ok) {
                return (await o.json()).summary
            }
            throw Error("請求失敗")
        } catch (e) {
            return "AbortError" === e.name ? console.error("請求超時") : console.error("請求失敗：", e), `獲取文章摘要超時。當你出現這個問題時，可能是因為文章過長導致的AI運算量過大， 您可以稍等一下然後重新切換到TianliGPT模式，或者嘗試使用${siteTitle}GPT模式。`
        }
    },
    tianliGPTGenerate: async function() {
        const e = heoGPT.fetchTianliGPT(heoGPT.getTitleAndContent(), keys);
        heoGPT.aiShowAnimation(e)
    },
    toggleGPTModel: function() {
        if (heoGPTIsRunning) return;
        const e = document.getElementById("ai-tag");
        "TianliGPT" === heoGPTModel ? (heoGPTModel = `${siteTitle}GPT`, heoGPT.aiShowAnimation(Promise.resolve(heo_aiPostExplanation)), e.innerText = `${siteTitle}GPT`) : (heoGPTModel = "TianliGPT", heoGPT.tianliGPTGenerate(), e.innerText = "TianliGPT")
    },
    aiShowAnimation: function(e, o = !1) {
        const n = document.querySelector(".ai-explanation");
        if (!n) return;
        if (heoGPTIsRunning) return;
        heoGPTIsRunning = !0, heoGPT.cleanSuggestions();
        document.querySelector(".ai-tag").classList.add("loadingAI");
        n.style.display = "block", n.innerHTML = '生成中...<span class="blinking-cursor"></span>';
        let t, i, a = !0,
            s = 0,
            l = !0;
        const r = new IntersectionObserver((e => {
            let o = e[0].isIntersecting;
            o && !a ? (a = !0, requestAnimationFrame(i)) : o || (a = !1)
        }), {
            threshold: 0
        });
        e.then((e => {
            t = performance.now(), i = () => {
                if (s < e.length && a) {
                    const l = performance.now(),
                        c = l - t,
                        T = e.slice(s, s + 1),
                        h = /[，。！、？,.!?]/.test(T),
                        u = /[a-zA-Z0-9]/.test(T);
                    let g;
                    if (g = h ? 100 * Math.random() + 100 : u ? 10 : 25, c >= g)
                        if (n.innerText = e.slice(0, s + 1), t = l, s++, s < e.length) n.innerHTML = e.slice(0, s) + '<span class="blinking-cursor"></span>';
                        else {
                            n.innerHTML = e, n.style.display = "block", heoGPTIsRunning = !1;
                            document.querySelector(".ai-tag").classList.remove("loadingAI"), r.disconnect(), o && heoGPT.createSuggestions()
                        } a && requestAnimationFrame(i)
                }
            }, a && l && setTimeout((() => {
                requestAnimationFrame(i), l = !1
            }), 3e3), r.observe(n)
        })).catch((e => {
            console.error("獲取資訊失敗:", e), n.innerHTML = "獲取資訊失敗", n.style.display = "block", heoGPTIsRunning = !1;
            document.querySelector(".ai-tag").classList.remove("loadingAI"), r.disconnect()
        }))
    },
    synonymReplace: async function(e) {
        await heoGPT.loadHeogpt();
        const o = Object.keys(heogpt);
        for (let n = 0; n < o.length; n++) {
            const t = o[n],
                i = heogpt[t],
                a = RegExp(t, "gi");
            e = e.replace(a, (() => {
                const e = Math.floor(Math.random() * i.length);
                return i[e]
            }))
        }
        return e
    },
    createSuggestionItemWithAction: function(e, o) {
        const n = document.querySelector(".ai-suggestions");
        if (!n) return void console.error("無法找到具有class為ai-suggestions的元素");
        const t = document.createElement("div");
        t.classList.add("ai-suggestions-item"), t.textContent = e, t.addEventListener("click", (() => {
            o()
        })), n.appendChild(t)
    },
    cleanSuggestions: function() {
        const e = document.querySelector(".ai-suggestions");
        e ? e.innerHTML = "" : console.error("無法找到具有class為ai-suggestions的元素")
    },
    createSuggestions: function() {
        function e() {
            window.open("/p/ec57d8b2.html", "_blank")
        }
        aiTalkMode && (heoGPT.cleanSuggestions(), "HeoGPT" === heoGPTModel ? (heoGPT.createSuggestionItemWithAction(`誰是${siteTitle}？`, (() => {
            heoGPT.aiShowAnimation(Promise.resolve("張洪Heo 是一位設計師，他的主要職業是圖形設計師、UI/視覺設計師和產品設計師。他的GitHub首頁上有一些他的作品。此外，他還開發了一個名為“敲木魚”的應用程式，該應用程式旨在透過音效和文字顯示來提高用戶體驗。如果您想了解更多關於張洪Heo的資訊，可以訪問他的個人網站或部落格。"), !0)
        })), heoGPT.createSuggestionItemWithAction("這篇文章講了什麼？", (() => {
            heoGPT.aiShowAnimation(Promise.resolve(heo_aiPostExplanation), !0)
        })), heoGPT.createSuggestionItemWithAction("帶我去看看其他文章", (() => toRandomPost())), heoGPT.createSuggestionItemWithAction("怎麼才能給我的網站安裝一個AI摘要？", (() => e()))) : "TianliGPT" === heoGPTModel && (heoGPT.createSuggestionItemWithAction("怎麼才能給我的網站安裝一個AI摘要？", (() => e())), heoGPT.createSuggestionItemWithAction("帶我去Tianli的部落格", (() => {
            window.open("https://tianli-blog.club/", "_blank")
        }))))
    }
};

function AIEngine() {
    const e = document.querySelector(".ai-tag");
    e && e.addEventListener("click", (() => {
        heoGPTIsRunning || (aiTalkMode = !0, `${gptName}GPT` === heoGPTModel ? heoGPTTalkMode() : tianliGPTTalkMode())
    }))
}

function addAIToggleListener() {
    const e = document.querySelector("#ai-Toggle");
    e && e.addEventListener("click", (() => {
        heoGPT.toggleGPTModel()
    }))
}

function heoGPTTalkMode() {
    document.querySelectorAll(".ai-suggestions") && heoGPT.aiShowAnimation(Promise.resolve(`我是${siteTitle}的摘要生成助理${gptName}GPT，是一個基於GPT-4與${gptName}Correction的混合語言模型。我在這裡只負責摘要的預生成和顯示，你無法與我直接溝通，但我可以回答一些預設的問題。`), !0)
}

function tianliGPTTalkMode() {
    document.querySelectorAll(".ai-suggestions") && heoGPT.aiShowAnimation(Promise.resolve("你好，我是摘要生成助理TianliGPT，TianliGPT在訪客訪問時進行摘要的撰寫。我在這裡只負責摘要的即時生成和顯示，你無法與我直接溝通，如果你也需要一個這樣的AI摘要介面，可以在下方查看部署教學。"), !0)
}