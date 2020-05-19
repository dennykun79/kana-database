importPackage(java.io);
importPackage(java.lang);
scriptName = "kana";
Bot = BotManager.getCurrentBot();
blank = "​".repeat(500);
line = "━".repeat(23);
com = org.jsoup.Jsoup.connect("http://koyume.dothome.co.kr/express.txt").get().text().replace(/{엔터}/g, "\n");
function readDB(path) {
    let t = new java.io.File(path);
    if (!t.exists()) 
        return null;
    let a = new FileInputStream(t), n = new InputStreamReader(a), r = new BufferedReader(n), s = r.readLine(), o = "";
    while ((o = r.readLine()) != null) 
        s += "\n" + o;
    a.close() , n.close() , r.close();
    return JSON.parse(s.toString());
}
;
function saveDB(path, str) {
    let f = new File(path);
    if (!f.exists()) {
        f.getParentFile().mkdirs();
        f.createNewFile();
    }
    let a = new FileOutputStream(f);
    a.write(new java.lang.String(JSON.stringify(str)).getBytes());
    a.close();
}
;
function getData(path, ex) {
    return readDB(path) ? readDB(path) : ex;
}
;
function getTime() {
    return new Date().toLocaleString().replace("초 GMT+09:00", ".") + String(new Date().getMilliseconds()).padStart(3, "0") + "초";
}
;
function getDate() {
    return new Date().getFullYear() + "/" + String(new Date().getMonth() + 1).padStart(2, "0") + "/" + String(new Date().getDate()).padStart(2, "0");
}
;
function strOmit(str, num) {
    return num < str.length ? str.substring(0, num) + "..." : str;
}
;
function naturalExp(str, t, a) {
    return (str.charCodeAt(str.length - 1) - 44032) % 28 == 0 ? str + t : str + a;
}
;
function healBar(e, t) {
    let r = Math.round(e / t * 100), last = {
    0: "", 
    1: "▏", 
    2: "▎", 
    3: "▍", 
    4: "▌", 
    5: "▋", 
    6: "▊", 
    7: "▉", 
    8: "█", 
    9: "█"}, graph = "|" + (e > t ? "█".repeat(10) : "█".repeat(r / 10) + last[r % 10] + " ".repeat(4).repeat((100 - r) / 10)) + "| ";
    return graph + e + "/" + t + " (" + (e / t * 100).toFixed(2) + "%)";
}
;
function wordSplit(str) {
    let f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'], s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'], t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'], ga = 44032, arr = [];
    for (let i = 0; i < str.length; i++) {
        let un = str.charCodeAt(i);
        if (str[i].match(/[가-힣]/) != null) {
            un = un - ga;
            arr.push(f[parseInt(un / 588)]);
            arr.push(s[parseInt((un - (parseInt(un / 588) * 588)) / 28)]);
            arr.push(t[parseInt(un % 28)]);
        } else 
            arr.push(str[i]);
    }
    return arr;
}
;
function similar(a, b) {
    a = wordSplit(a) , b = wordSplit(b);
    let costs = new Array(b.length + 1);
    let l = Math.max(a.length, b.length);
    for (let j = 0; j < costs.length; j++) 
        costs[j] = j;
    for (let i = 0; i <= a.length; i++) {
        costs[0] = i;
        let nw = i - 1;
        for (let j = 1; j <= b.length; j++) {
            let cj = Math.min(1 + Math.min(costs[j], costs[j - 1]), a[i - 1] == b[j - 1] ? nw : nw + 1);
            nw = costs[j];
            costs[j] = cj;
        }
    }
    return ((100 - (costs[b.length] / l * 100)) | 0);
}
;
function botStatus() {
    let am = App.getContext().getSystemService(App.getContext().ACTIVITY_SERVICE);
    let mem = new android.app.ActivityManager.MemoryInfo();
    am.getMemoryInfo(mem);
    let a = (mem.totalMem / 1024 / 1024 / 1024).toFixed(2);
    let b = (mem.availMem / 1024 / 1024 / 1024).toFixed(2);
    var k = App.getContext().getSystemService(android.content.Context.WIFI_SERVICE).getConnectionInfo();
    return "[ 메모리 ]\n" + a + "GB / " + (a - b).toFixed(2) + "GB (" + ((b / a) * 100).toFixed(2) + "% 남음)\n\n" + "[ 배터리 ]\n잔량 : " + Device.getBatteryLevel() + "% \n" + "전압 : " + (Device.getBatteryVoltage() * 0.001).toFixed(2) + "V \n" + "온도 : " + (Device.getBatteryTemperature() * 0.1).toFixed() + "\xb0C\n\n" + "[ 인터넷 ]\n주파수 : " + (k.frequency / 1024).toFixed(2) + "GHz\n속도: " + k.getLinkSpeed() + "Mbps\n모드 : " + k.wifiMode;
}
;
String.prototype.Arrayreplace = function(from, to) {
    if (!from instanceof Array || !to instanceof Array) 
        throw new TypeError("Invalid parameter");
    if (from.length != to.length) 
        throw new RangeError("range of \"from\" and \"to\" must be same.");
    let str = this;
    for (let i in from) 
        str = str.replace(from[i], to[i]);
    return str;
};
let daycheckPath = "sdcard/[ kana ]/daycheck.txt", roomlistPath = "sdcard/[ kana ]/roomlist.txt", attendPath = "sdcard/[ kana ]/attend/", chatlogPath = "sdcard/[ kana ]/chatlog/obj.txt", chatrankPath = "sdcard/[ kana ]/chatrank/", learnPath = "sdcard/[ kana ]/learn/obj.txt", customPath = "sdcard/[ kana ]/custom/obj.txt";
dayCheck = getData(daycheckPath, new Date().toISOString().substring(0, 10).replace(/-/g, "/"), true);
roomlist = getData(roomlistPath, []);
attendData = getData(attendPath + dayCheck + ".txt", []);
chatlogData = getData(chatlogPath, []);
chatrankData = getData(chatrankPath + dayCheck + ".txt", []);
learnData = getData(learnPath, []);
customData = getData(customPath, []);
function Attend(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat;
    this.userData = attendData.find(a => a.name == sender && a.room == room) , this.roomData = attendData.filter(a => a.room == room);
    this.put = function() {
    if (!userData) {
        let time = getTime();
        attendData.push({
    room: room, 
    name: sender, 
    roomrank: roomData.length + 1, 
    time: time});
        saveDB(attendPath + dayCheck + ".txt", attendData);
        return sender + "님! 출석을 완료했어요!\n전체방 : " + attendData.length + "등, 현재방 : " + (roomData.length + 1) + "등\n출석시간: " + time;
    }
    let index = attendData.indexOf(userData);
    return sender + "님은 이미 출석했어요!\n전체방 : " + (index + 1) + "등, 현재방 : " + attendData[index].roomrank + "등";
};
    this.myList = function() {
    if (!userData) 
        return sender + "님은 아직 출석하지 않았습니다!";
    with (attendData[attendData.indexOf(userData)]) 
        return "[ " + sender + "님의 출석정보 ]\n\n" + "전체방 : " + (attendData.indexOf(userData) + 1) + "등, 현재방 : " + roomrank + "등\n출석시간 : " + time;
};
    this.roomList = function() {
    if (roomData.length < 1) 
        return "현재 방에는 아직 아무도 출석하지 않았습니다!";
    let r = roomData.map((e, i) => "[ " + (i + 1) + "등 ] : " + e.name + "\n" + e.time);
    r = line + "\n" + r.join("\n" + line + "\n") + "\n" + line;
    return "[ " + room + " 방의 출석목록 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + r;
};
    this.allList = function() {
    if (attendData.length < 1) 
        return "전체 방에는 아직 아무도 출석하지 않았습니다!";
    let r = attendData.map((e, i) => "[ " + (i + 1) + "등 ] : " + strOmit(e.room, 5) + " - " + e.name + "\n" + e.time);
    r = line + "\n" + r.join("\n" + line + "\n") + "\n" + line;
    return "[ 전체 방의 출석목록 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + r;
};
    this.attendCount = function() {
    let data = new java.io.File(attendPath + getDate()).listFiles().join("\n").split("\n").map(e => readDB(e));
    let count = {
    att: 0, 
    all: 0, 
    room: 0};
    for (let i of data) {
        let userd = i.find(a => a.name == sender && a.room == room), roomd = i.filter(a => a.room == room);
        userd && count.att++;
        i.indexOf(userd) == 0 && count.all++;
        roomd.indexOf(userd) == 0 && count.room++;
    }
    with (count) 
        return "[ " + sender + "님의 " + (new Date().getMonth() + 1) + "월 출석기록 ]\n총 출석횟수 : " + att + "회\n전체방 1등 : " + all + "회\n현재방 1등 : " + room + "회";
};
    this.dateList = function(date) {
    if (date == "나") 
        return attendCount();
    if (date == dayCheck) 
        return "오늘 날짜의 출석기록은 출석목록 명령어를 이용해주세요!";
    let data = readDB(attendPath + date + ".txt");
    if (!data) 
        return "명령어 입력이 잘못 되었거나 해당 날짜의 출석기록이 존재하지 않습니다!";
    if (data.length < 1) 
        return "해당 날짜에는 아무도 출석하지 않았습니다!";
    let r = data.map((e, i) => "[ " + (i + 1) + "등 ] : " + strOmit(e.room, 5) + " - " + e.name + "\n" + e.time);
    r = line + "\n" + r.join("\n" + line + "\n") + "\n" + line;
    return "[ " + date + " 날짜의 출석기록 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + r;
};
    try {
        if (!isGroupChat) 
            return;
        let res = [];
        ["ㅊㅊ", "출석", "출첵"].some(a => msg.equals(a)) && res.push(put());
        if (msg.startsWith("출석목록")) {
            let data = msg.replace("출석목록 ", ""), result = {
    "나": myList(), 
    "방": roomList(), 
    "전체": allList()};
            res.push(result[data] ? result[data] : "명령어 입력이 잘못 되었습니다!\n출석목록은 나, 방, 전체로 사용이 가능합니다.");
        }
        if (msg.startsWith("출석기록")) 
            res.push(dateList(msg.replace("출석기록 ", "")));
        let a = ["출석", "출첵", "출석목록 나", "출석목록 방", "출석목록 전체", "출석기록 나"].filter(e => similar(e, msg) > 70);
        !a.includes(msg) && a.length > 0 && res.push("...혹시 이 명령어를 찾으셨나요?\n[ " + a.join(", ") + " ]");
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
    }  catch (e) {
    bot.reply("∮ ⚠️출석관련 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");
}
}
;
function ChatLog(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat;
    this.senderLog = function(name) {
    let data = chatlogData.filter(a => a.room == room && a.name == name).splice(0, 500);
    data = data.map((e, i) => (i + 1) + ". " + e.msg + "\n전송시간 : " + e.time);
    return "[ " + name + " 님의 채팅로그 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.roomLog = function(room) {
    let data = chatlogData.filter(a => a.room == room).splice(0, 500);
    data = data.map((e, i) => "[ " + (i + 1) + " ]\n전송한사람 : " + e.name + "\n메시지 : " + e.msg + "\n전송시간 : " + e.time);
    return "[ " + room + " 방의 채팅로그 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.allLog = function() {
    let data = chatlogData.splice(0, 500).map((e, i) => "[ " + (i + 1) + " ]\n전송한 방 : " + strOmit(e.room, 5) + "\n전송한사람 : " + e.name + "\n메시지 : " + e.msg + "\n전송시간 : " + e.time);
    return "[ 전체 방의 채팅로그 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    try {
        if (!isGroupChat) 
            return;
        let res = [];
        if (msg.startsWith("채팅로그")) {
            let data = msg.replace("채팅로그 ", "");
            result = {
    "나": senderLog(sender), 
    "방": roomLog(room)};
            res.push(result[data] ? result[data] : "명령어 입력이 잘못 되었습니다!\n채팅로그는 나, 방으로 사용이 가능합니다.");
        }
                msg == "채팅저장" ? (saveDB(chatlogPath, chatlogData) , bot.reply("채팅로그를 저장하였습니다!\n저장된 채팅 수 : " + chatlogData.length + "개")) : 0;
        let a = ["채팅로그 나", "채팅로그 방", "채팅저장"].filter(e => similar(e, msg) > 70);
        !a.includes(msg) && a.length > 0 && res.push("...혹시 이 명령어를 찾으셨나요?\n[ " + a.join(", ") + " ]");
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
        chatlogData.unshift({
    room: room, 
    name: sender, 
    msg: msg, 
    time: getTime()});
    }  catch (e) {
    bot.reply("∮ ⚠️채팅로그관련 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");
}
}
;
function ChatRank(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat;
    this.userData = chatrankData.find(a => a.name == sender && a.room == room);
    this.roomRank = function(room) {
    let n = {}, data = chatrankData.filter(a => a.room == room);
    for (let e of data) 
                n[e.times] ? n[e.times].push(e.name) : n[e.times] = [e.name];
    let e = Object.keys(n).reverse(), o = 0;
    e.forEach(e => o += e * n[e].length);
    let t = e.map((e, l) => "[ " + (l + 1) + "위 ] : " + e + "회 " + healBar(e, o) + " (" + n[e].length + "명)\n* " + n[e].join("\n* "));
    t = line + "\n" + t.join("\n" + line + "\n") + "\n" + line;
    return "[ " + room + " 방의 채팅순위 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + t;
};
    this.allRank = function() {
    let check = {};
    for (let i of chatrankData) 
                check[i.times] ? check[i.times].push(strOmit(i.room, 5) + " - " + i.name) : check[i.times] = [strOmit(i.room, 5) + " - " + i.name];
    let l = Object.keys(check).reverse(), s = 0;
    l.forEach(e => s += e * check[e].length);
    let r = l.map((e, i) => "[ " + (i + 1) + "위 ] : " + e + "회 " + healBar(e, s) + " (" + check[e].length + "명)\n* " + check[e].join("\n* "));
    r = line + "\n" + r.join("\n" + line + "\n") + "\n" + line;
    return "[ 전체 방의 채팅순위 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + r;
};
    this.dateRank = function(date) {
    if (date == dayCheck) 
        return "오늘 날짜의 채팅순위기록은 채팅순위 명령어를 이용해주세요!";
    let data = readDB(chatrankPath + date + ".txt");
    if (!data) 
        return "명령어 입력이 잘못 되었거나 해당 날짜의 채팅순위기록이 존재하지 않습니다!";
    if (data.length < 1) 
        return "해당 날짜에는 아무도 채팅을 치지 않았습니다!";
    let check = {};
    for (let i of data) 
                check[i.times] ? check[i.times].push(strOmit(i.room, 5) + " - " + i.name) : check[i.times] = [strOmit(i.room, 5) + " - " + i.name];
    let l = Object.keys(check).reverse(), s = 0;
    l.forEach(e => s += e * check[e].length);
    let r = l.map((e, i) => "[ " + (i + 1) + "위 ] : " + e + "회 " + healBar(e, s) + " (" + check[e].length + "명)\n* " + check[e].join("\n* "));
    r = line + "\n" + r.join("\n" + line + "\n") + "\n" + line;
    return "[ " + date + " 날짜의 채팅순위기록 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + r;
};
    try {
        if (!isGroupChat) 
            return;
        let res = [];
        if (msg.startsWith("채팅순위 ")) {
            let data = msg.replace("채팅순위 ", "");
            result = {
    "방": roomRank(room), 
    "전체": allRank()};
            res.push(result[data] ? result[data] : "명령어 입력이 잘못 되었습니다!\n채팅순위는 방, 전체로 사용이 가능합니다.");
        }
        msg.startsWith("채팅순위기록") && res.push(dateRank(msg.replace("채팅순위기록 ", "")));
        let a = ["채팅순위 방", "채팅순위 전체", "채팅순위기록"].filter(e => similar(e, msg) > 70);
        !a.includes(msg) && a.length > 0 && res.push("...혹시 이 명령어를 찾으셨나요?\n[ " + a.join(", ") + " ]");
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
                userData ? chatrankData[chatrankData.indexOf(userData)].times++ : chatrankData.push({
    room: room, 
    name: sender, 
    times: 1});
        saveDB(chatrankPath + dayCheck + ".txt", chatrankData);
    }  catch (e) {
    /*bot.reply("∮ ⚠️채팅순위관련 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");*/

}
}
;
function Learn(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat, msgData = learnData.find(a => a.room == room && a.name.trim() == msg);
    this.put = function(room, sender, name, say) {
    let data = learnData.find(a => a.room == room && a.name == name);
    if (!data) {
        data = {
    room: room, 
    user: sender, 
    name: name, 
    say: [], 
    times: 0, 
    time: getTime()};
        learnData.push(data);
    }
    learnData[learnData.indexOf(data)].say.push(say);
    saveDB(learnPath, learnData);
    return "학습을 완료했습니다!\n\n[ 학습정보 ]\n반응할말 : " + name + "\n대답할말 : " + data.say.join(", ");
};
    this.remove = function(room, name) {
    let data = learnData.find(a => a.room == room && a.name == name);
    if (!data) 
        return naturalExp(name, "는", "은") + " 현재 방에 학습되지 않은 말입니다!";
    learnData.splice(learnData.indexOf(data), 1);
    saveDB(learnPath, learnData);
    return name + "에 관한 학습을 삭제했습니다!";
};
    this.roomList = function(room) {
    let data = learnData.filter(a => a.room == room).map((e, i) => "[ " + (i + 1) + " ] : " + e.name);
    return data.length < 1 ? "현재 방에는 학습된 키워드가 없습니다!" : "[ " + room + " 방의 학습목록 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.allList = function() {
    let data = learnData.map((e, i) => "[ " + (i + 1) + " ]\n방 : " + e.room + "\n반응할말 : " + e.name + "\n대답할말 : " + e.say.join(", ") + "\n응답횟수 : " + e.times + "회\n최초학습자 : " + e.user + "\n최초학습시간 : " + e.time);
    return "[ 전체 방의 학습목록 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.thisInfo = function(room, name) {
    let data = learnData.find(a => a.room == room && a.name == name);
    if (!data) 
        return naturalExp(name, "는", "은") + "현재 방에 학습되지 않은 말입니다!";
    with (data) 
        return "[ " + name + "의 학습정보 ]\n\n대답할말💬 : " + say.join(", ") + "\n응답횟수🗣 : " + times + "회\n최초학습자😊 : " + user + "\n최초학습시간⏰ : " + time;
};
    try {
        if (!isGroupChat) 
            return;
        let res = [];
                /학습추가 (.+)::(.+)/.test(msg) ? res.push(put(room, sender, RegExp.$1.trim(), RegExp.$2.trim())) : 0;
        msg.startsWith("학습삭제") && res.push(remove(room, msg.replace("학습삭제 ", "")));
        msg == "학습목록" && res.push(roomList(room));
        msg.startsWith("학습정보") && res.push(thisInfo(room, msg.replace("학습정보 ", "")));
        if (msgData) {
            res.push(msgData.say[Math.random() * msgData.say.length | 0]);
            learnData[learnData.indexOf(msgData)].times++;
            saveDB(learnPath, learnData);
        }
        let a = ["학습추가", "학습삭제", "학습목록", "학습정보"].filter(e => similar(e, msg) > 70);
        !a.includes(msg) && a.length > 0 && res.push("...혹시 이 명령어를 찾으셨나요?\n[ " + a.join(", ") + " ]");
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
    }  catch (e) {
    bot.reply("∮ ⚠️학습관련 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");
}
}
;
function Custom(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat, msgData = customData.find(a => a.room == room && msg.startsWith(a.name.trim()));
    this.put = function(room, sender, name, say) {
    let data = customData.find(a => a.room == room && a.name == name);
        data ? 0 : (data = {
    room: room, 
    user: sender, 
    name: name, 
    say: [], 
    times: 0, 
    time: getTime()} , customData.push(data));
    customData[customData.indexOf(data)].say.push(say);
    saveDB(customPath, customData);
    return "커스텀을 추가했습니다!\n\n[ 학습정보 ]\n반응할말 : " + name + "\n대답할말 : " + data.say.join(", ");
};
    this.remove = function(room, name) {
    let data = customData.find(a => a.room == room && a.name == name);
    if (!data) 
        return naturalExp(name, "는", "은") + " 현재 방에 커스텀되지 않은 말입니다!";
    customData.splice(customData.indexOf(data), 1);
    saveDB(customPath, customData);
    return name + "에 관한 커스텀을 삭제했습니다!";
};
    this.roomList = function(room) {
    let data = customData.filter(a => a.room == room).map((e, i) => "[ " + (i + 1) + " ] : " + e.name);
    return data.length < 1 ? "현재 방에는 추가된 커스텀이 없습니다!" : "[ " + room + " 방의 커스텀목록 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.allList = function() {
    let data = customData.map((e, i) => "[ " + (i + 1) + " ]\n방 : " + e.room + "\n반응할말 : " + e.name + "\n대답할말 : " + e.say.join(", ") + "\n응답횟수 : " + e.times + "회\n최초학습자 : " + e.user + "\n최초학습시간 : " + e.time);
    return "[ 전체 방의 커스텀목록 (" + data.length + "개) ]\n❄전체보기를 눌러 확인해주세요!❄" + blank + "\n\n" + line + "\n" + data.join("\n" + line + "\n") + "\n" + line;
};
    this.thisInfo = function(room, name) {
    let data = customData.find(a => a.room == room && a.name == name);
    if (!data) 
        return naturalExp(name, "는", "은") + "현재 방에 추가되지 않은 말입니다!";
    with (data) 
        return "[ " + name + "의 커스텀정보📃 ]\n\n대답할말💬 : " + say.join(", ") + "\n응답횟수🗣 : " + times + "회\n최초학습자😊 : " + user + "\n최초학습시간⏰ : " + time;
};
    this.saying = function(room, str) {
    let keyword = learnData.filter(a => a.room == room);
    if (keyword) 
        for (let i of keyword) 
        str = str.replace("{키워드:" + i.name.trim() + "}", i.say[Math.random() * i.say.length | 0]);
    return str.Arrayreplace(["{닉}", "{시간}", "{방}", "{입력값}"], [sender, getTime(), room, msg.replace(msgData.name, "")]);
};
    try {
        if (!isGroupChat) 
            return;
        let res = [];
                /커스텀추가 (.+)::(.+)/.test(msg) ? res.push(put(room, sender, RegExp.$1.trim(), RegExp.$2.trim())) : 0;
        msg.startsWith("커스텀삭제") && res.push(remove(room, msg.replace("커스텀삭제 ", "")));
        msg == "커스텀목록" && res.push(roomList(room));
        msg.startsWith("커스텀정보") && res.push(thisInfo(room, msg.replace("커스텀정보 ", "")));
        if (msgData) {
            res.push(saying(room, msgData.say[Math.random() * msgData.say.length | 0]));
            customData[customData.indexOf(msgData)].times++;
            saveDB(customPath, customData);
        }
        let a = ["커스텀추가", "커스텀삭제", "커스텀목록", "커스텀정보"].filter(e => similar(e, msg) > 70);
        !a.includes(msg) && a.length > 0 && res.push("...혹시 이 명령어를 찾으셨나요?\n[ " + a.join(", ") + " ]");
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
    }  catch (e) {
    bot.reply("∮ ⚠️커스텀관련 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");
}
}
;
function Main(bot) {
    let msg = bot.content, room = bot.room, sender = bot.author.name, isGroupChat = bot.isGroupChat;
    try {
        if (!isGroupChat) 
            return;
        let res = [];
        if (dayCheck != getDate()) {
            dayCheck = getDate() , attendData = [] , chatlogData = [] , chatrankData = [];
            saveDB(daycheckPath, dayCheck);
            saveDB(chatlogPath, []);
        }
        msg.startsWith("줄바꿈") && bot.reply(msg.substr(3).replace(/\n/g, "\\n"));
        (msg == "명령어" || msg == "도움말") && res.push("[ 봇 명령어 ]\n❄ 전체보기를 눌러 확인해주세요! ❄" + blank + "\n\n" + com);
        let saying = ["코유메 왔어요!", "네?", "왜 부르셨나요?", "네 " + sender + "님!", "배고파요! 뭐라도 사주세요!", "하잇!"];
                msg == "코유메" ? res.push(saying[Math.random() * saying.length | 0]) : 0;
        msg == "봇상태" && res.push(botStatus());
        let random = ["\"명령어\" 혹은 \"도움말\"로 제 기능을 볼 수 있어요!", "저는 앞뒤에 ∮가 있을 때만 봇이예요!", "갠톡은 봇이 작동하지 않아요!", "제 프로필에 하트 꾹 눌러주세요!", "오류가 발생했다면 1대1톡 프로필로 연락주세요!"];    /*Math.floor(Math.random() * 300)== 0 && bot.reply("∮ Tip) " + random[Math.random() * random.length | 0] + " ∮");*/

        !roomlist.find(a => a == room) && roomlist.push(room) && saveDB(roomlistPath, roomlist);
        res.length > 0 && bot.reply("∮ " + res.join("\n\n") + " ∮");
        sender == "kana" && msg.startsWith("ev") && bot.reply(eval(msg.substr(2)));
    }  catch (e) {
    bot.reply("∮ ⚠️메인 명령어 작동중 오류가 발생했습니다.⚠️\n오류내용 : " + e + e.lineNumber + " ∮");
}
}
;
for (let i of [Main, Attend, ChatLog, ChatRank, Learn, Custom]) 
    Bot.on(Event.MESSAGE, i);
