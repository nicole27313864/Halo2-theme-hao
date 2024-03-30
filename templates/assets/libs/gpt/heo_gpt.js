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
            throw Error("请求失败")
        } catch (e) {
            return "AbortError" === e.name ? console.error("请求超时") : console.error("请求失败：", e), `获取文章摘要超时。当你出现这个问题时，可能是因为文章过长导致的AI运算量过大， 您可以稍等一下然后重新切换到TianliGPT模式，或者尝试使用${siteTitle}GPT模式。`
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
            console.error("获取信息失败:", e), n.innerHTML = "获取信息失败", n.style.display = "block", heoGPTIsRunning = !1;
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
        if (!n) return void console.error("无法找到具有class为ai-suggestions的元素");
        const t = document.createElement("div");
        t.classList.add("ai-suggestions-item"), t.textContent = e, t.addEventListener("click", (() => {
            o()
        })), n.appendChild(t)
    },
    cleanSuggestions: function() {
        const e = document.querySelector(".ai-suggestions");
        e ? e.innerHTML = "" : console.error("无法找到具有class为ai-suggestions的元素")
    },
    createSuggestions: function() {
        function e() {
            window.open("/p/ec57d8b2.html", "_blank")
        }
        aiTalkMode && (heoGPT.cleanSuggestions(), "HeoGPT" === heoGPTModel ? (heoGPT.createSuggestionItemWithAction(`谁是${siteTitle}？`, (() => {
            heoGPT.aiShowAnimation(Promise.resolve("张洪Heo 是一位设计师，他的主要职业是图形设计师、UI/视觉设计师和产品设计师。他的GitHub主页上有一些他的作品。此外，他还开发了一个名为“敲木鱼”的应用程序，该应用程序旨在通过音效和文字显示来提高用户体验。如果您想了解更多关于张洪Heo的信息，可以访问他的个人网站或博客。"), !0)
        })), heoGPT.createSuggestionItemWithAction("这篇文章讲了什么？", (() => {
            heoGPT.aiShowAnimation(Promise.resolve(heo_aiPostExplanation), !0)
        })), heoGPT.createSuggestionItemWithAction("带我去看看其他文章", (() => toRandomPost())), heoGPT.createSuggestionItemWithAction("怎么才能给我的网站安装一个AI摘要？", (() => e()))) : "TianliGPT" === heoGPTModel && (heoGPT.createSuggestionItemWithAction("怎么才能给我的网站安装一个AI摘要？", (() => e())), heoGPT.createSuggestionItemWithAction("带我去Tianli的博客", (() => {
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
    document.querySelectorAll(".ai-suggestions") && heoGPT.aiShowAnimation(Promise.resolve(`我是${siteTitle}的摘要生成助理${gptName}GPT，是一个基于GPT-4与${gptName}Correction的混合语言模型。我在这里只负责摘要的预生成和显示，你无法与我直接沟通，但我可以回答一些预设的问题。`), !0)
}

function tianliGPTTalkMode() {
    document.querySelectorAll(".ai-suggestions") && heoGPT.aiShowAnimation(Promise.resolve("你好，我是摘要生成助理TianliGPT，TianliGPT在访客访问时进行摘要的撰写。我在这里只负责摘要的实时生成和显示，你无法与我直接沟通，如果你也需要一个这样的AI摘要接口，可以在下方查看部署教程。"), !0)
}