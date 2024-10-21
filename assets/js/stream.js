const DataType = (item) => {
    return item.parts && item.parts.length > 0 && item.parts[0].content && item.parts[0].content.length > 0 ? item.parts[0].content[0].type : '';
}
let resStatus = 200;
let responseData = [];
getChatContent = async function (para, callback) {
    const apiUrl = 'https://chatglm.cn/chatglm/backend-api/assistant/stream';
    const headers = {
        'Accept': 'text/event-stream',
        'App-name': 'chatglm',
        'Authorization': `Bearer ${para.token}`,
        'Content-Type': 'application/json',
        'X-App-Platform': 'pc',
        'X-App-Version': '0.0.1',
        'X-Device-Id': para.deviceId,
        'X-Lang': 'zh',
        'X-Request-Id': para.requestId
    };
    var payload = {
        "assistant_id": para.modelId,
        "conversation_id": para.converseId,
        "meta_data": {
            "mention_conversation_id": "",
            "is_test": false,
            "input_question_type": "xxxx",
            "channel": "",
            "draft_id": "",
            "quote_log_id": "",
            "platform": "pc"
        },
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": para.text
                    }
                ]
            }
        ]
    }
    if (para.images && para.images.length > 0) {
        let images = { type: 'image', image: para.images };
        payload.messages[0].content.push(images)
    }
    const body = JSON.stringify(payload);
    const res = await fetch(apiUrl, {
        method: "POST",
        headers,
        body,
        signal: controller.signal
    });
    responseData = [];
    const reader = res.body.getReader();
    resStatus = res.status;
    //let readChunk;
    const readChunk = async () => {
        return reader.read().then(async ({ value, done }) => {
            if(done){ callback({ status: resStatus, done: done, data: null }); return; }
            const decoder = new TextDecoder();
            value = decoder.decode(value);
            
            let text = value.replaceAll('\n\nevent:message\ndata: ', ',').replaceAll('event:message\ndata: ', '');
            let ret = `[${text}]`;
            let chunks ;
            try{
                chunks = JSON.parse(ret);
            }
            catch(e){
                return readChunk();
            }
            if (!chunks || chunks.length === 0) return readChunk();
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                
                if (chunk) {
                    //console.log('chunk type = ', DataType(chunk), ' chunk = ',chunk);
                    callback({ status: resStatus, done: done, data: chunk });
                }
            }
            return readChunk();
        });
    }
    await readChunk();
}
const isTextData = (item) => {
    return item.parts && item.parts.length > 0 && item.parts[0].content && item.parts[0].content.length > 0 && item.parts[0].content[0].type === 'text'
}
const isImageData = (item) => {
    return item.parts && item.parts.length > 0 && item.parts[0].content && item.parts[0].content.length > 0 && item.parts[0].content[0].type === 'image' && item.parts[0].content[0].image && item.parts[0].content[0].image.length > 0;
}
const quoteResultDataDelta = (data) => {
    debugger;
    if(!data.content || data.content.length === 0 || !data.meta_data || !data.meta_data.metadata_list || data.meta_data.metadata_list.length === 0) return '';
    let html = `<div class="response-image">`
    data.meta_data.metadata_list.forEach((item) => {
        html += `<div class="response-image-item" ><a href="${item.url}" class="avatar">${item.title}</a></div>`;
    });
    html += `</div>`
    return html;
}
const imageDataDelta = (images) =>{
    if(!images || images.length === 0) return '';
    //let imgHtml = `<div class="response-image">`
    let imgHtml = '';
    images.forEach((img) => {
        imgHtml += `![这是图片AI生成图片的描述](${img.image_url} "这是AI生成的图片标题")`;  //`<div class="response-image-item" ><img src="${img.image_url}" class="avatar"></div>`;
        //imgHtml += `<div class="response-image-item" >![这是图片描述](${img.image_url} "这是图片标题")</div>`;
    });
    //imgHtml += `</div>`
    return imgHtml;
}
const isBrowserResultData = (item) => {
    return item.parts && item.parts.length > 0 && item.parts[0].content && item.parts[0].content.length > 0 && item.parts[0].content[0].type === 'browser_result'
}
const isQuoteResultData = (item) => {
    return item.parts && item.parts.length > 0 && item.parts[0].content && item.parts[0].content.length > 0 && item.parts[0].content[0].type === 'quote_result'
}
const apiUrl = 'https://chatglm.cn/chatglm/backend-api/assistant/stream';
async function getStream(para, callback) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'text/event-stream');
    xhr.setRequestHeader('App-name', 'chatglm');
    xhr.setRequestHeader('Authorization', `Bearer ${para.token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-App-Platform', 'pc');
    xhr.setRequestHeader('X-App-Version', '0.0.1');
    xhr.setRequestHeader('X-Device-Id', para.deviceId);
    xhr.setRequestHeader('X-Lang', 'zh');
    xhr.setRequestHeader('X-Request-Id', para.requestId)

    var payload = {
        "assistant_id": para.modelId,
        "conversation_id": para.converseId,
        "meta_data": {
            "mention_conversation_id": "",
            "is_test": false,
            "input_question_type": "xxxx",
            "channel": "",
            "draft_id": "",
            "quote_log_id": "",
            "platform": "pc"
        },
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": para.text
                    }
                ]
            }
        ]
    }
    if(para.modelId === '65a232c082ff90a2ad2f15e2'){
        let cogview ;
        if(!para.cogview) cogview = {aspect_ratio: "1:1", style: "none"}
        cogview = para.cogview;
        payload.meta_data.cogview = cogview;
    }
    if (para.images && para.images.length > 0) {
        let images = { type: 'image', image: para.images };
        payload.messages[0].content.push(images)
    }
    // "quote_result"、
    xhr.onreadystatechange = function () {
        /*if (xhr.readyState === 3 && xhr.status == 200) {
            const eventSource = new EventSource(apiUrl);
            eventSource.onmessage = event => {
                console.log('Received data:', event.data);
              };
          
              eventSource.onerror = error => {
                console.error('EventSource failed:', error);
                eventSource.close();
              };
        }
        else */if(xhr.readyState === 4 && xhr.status === 200){
            let text = xhr.responseText.replaceAll('\n\nevent:message\ndata: ', ',').replaceAll('event:message\ndata: ', '');
            let ret = `[${text}]`;
            try{
                let chunks = JSON.parse(ret);
                chunks.forEach((chunk, index) => {
                    //console.log('chunk type = ', DataType(chunk));
                    callback({ status: xhr.status, done: (index === chunks.length - 1 ? true : false), data: chunk });
                    //callback({ status: xhr.status, progressStatus: (index === data.length - 1 ? 'finish' : 'init'), data: item });
                });
            }
            catch(e){
                console.log('error = ',e.message);
            }
        }
        else if(xhr.readyState === 14 && xhr.status === 200){
            callback({ status: xhr.status, done: true, data: null });
        }
        else if (xhr.readyState === 40 && xhr.status == 200) {
            debugger;
            let text = xhr.responseText.replaceAll('\n\nevent:message\ndata: ', ',').replaceAll('event:message\ndata: ', '');
            let ret = `[${text}]`;
            //try{
            let data = JSON.parse(ret);
            let textData = data.filter(item => item.hasOwnProperty('parts') && isTextData(item));
            //console.log('textData = ', textData);
            textData.map((item, index) => {
                if (index === 0) item.parts[0].content[0].delta = item.parts[0].content[0].text;
                else {
                    let delta = item.parts[0].content[0].text.substring(textData[index - 1].parts[0].content[0].text.length);
                    item.parts[0].content[0].delta = delta;
                }
                return item;
            })
            data.forEach((item, index) => {
                    /*if(isTextData(item)) {
                        let deltaData = textData.find(text => text && text.parts[0].content[0].text === item.parts[0].content[0].text);
                        if(deltaData) {
                            item.parts[0].content[0].delta = unicodeToChinese(deltaData[0].parts[0].content[0].delta);
                            item.parts[0].content[0].text = unicodeToChinese(deltaData[0].parts[0].content[0].text);
                        }
                        else item.parts[0].content[0].delta = '';
                    }
                    else */if (isImageData(item)) {
                    item.parts[0].content[0].delta = imageDataDelta(item.part[0].content[0]);
                }
                callback({ status: xhr.status, progressStatus: (index === data.length - 1 ? 'finish' : 'init'), data: item });
            });
            //callback({status: xhr.status, readyState: xhr.readyState, data: data});
            /*}catch(e){
                debugger;
                console.log('error.02 = ',e.message);
            }*/
            /*console.log('readyState === 4,  xhr.method = ', xhr.method, '  timer = ', Math.random())
            var events = xhr.responseText.split(`\n\nevent:message\ndata: `);
            events = events.map(item => item.startsWith('event:message\ndata: ') ? unicodeToChinese(item.replace('event:message\ndata: ','')) : unicodeToChinese(item));
            events.forEach(function(event) {
                var jsonStr = escapeBackslashes(event);
                if (jsonStr) {
                    let data = '';
                    try{
                        data = JSON.parse(jsonStr);
                    }catch(e){
                        console.log('error.02 = ',e.message);
                    }
                    callback({status: xhr.status, readyState: xhr.readyState, data: data});
                }
            });*/
        }
    }
    xhr.send(JSON.stringify(payload));

}
function escapeBackslashes(input) {
    // 用于构建最终字符串的数组
    let result = [];
    // 当前索引
    let index = 0;
    // 用于跟踪是否遇到转义序列（例如 \n 或 \t）
    let isEscaping = false;

    while (index < input.length) {
        let currentChar = input[index];

        // 检查当前字符是否为反斜杠
        if (currentChar === '\\') {
            // 检查下一个字符来确定是否是转义序列
            let nextChar = input[index + 1];
            if (nextChar && (nextChar === 'n' || nextChar === 'r' || nextChar === 't' || nextChar === '\\' || nextChar === '"' || nextChar === '\'')) {
                // 如果是转义序列，则直接添加到结果中
                result.push(currentChar + nextChar);
                // 跳过下一个字符，因为它已经被处理了
                index += 2;
            } else {
                // 如果不是转义序列，则添加两个反斜杠来转义
                result.push('\\\\');
                // 移动到下一个字符
                index++;
            }
        } else {
            // 如果当前字符不是反斜杠，则直接添加到结果中
            result.push(currentChar);
            // 移动到下一个字符
            index++;
        }
    }

    // 将数组转换为字符串并返回
    return result.join('');
}
/*
// 示例字符串，其中包含普通反斜杠和转义反斜杠
var rawString = '{"message": "This is a newline:\\nAnd this is a backslash: \\"}';
 
// 使用自定义函数处理字符串
var jsonString = escapeBackslashes(rawString);
 
// 现在jsonString是一个有效的JSON格式的字符串
// 使用JSON.parse()将字符串转换为JSON对象
var jsonObject = JSON.parse(jsonString);
 
// 输出转换后的JSON对象
console.log(jsonObject);
// 输出: { message: 'This is a newline:\nAnd this is a backslash: \\' }
*/
function unicodeToChinese(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
}

const refreshZhipuAuth = async (para, callback) => {
    /*const url = 'https://chatglm.cn/chatglm/user-api/user/refresh'
    let headers = {
        Authorization: data.refresh_token,
        "Content-Type": "application/json;charset=utf-8",
        "App-Name": "chatglm",
        "X-Device-Id": data.deviceId,
        "X-App-Platform": 'pc',
        "X-App-Version": '0.0.1',
        "X-Request-Id": data.requestId
    }
    const res = await fetch(url, {method: "POST", headers:headers, body: {}});
    debugger;*/
    const url = 'https://chatglm.cn/chatglm/user-api/user/refresh'
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('App-name', 'chatglm');
    xhr.setRequestHeader('Authorization', `Bearer ${para.refresh_token}`);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('X-App-Platform', 'pc');
    xhr.setRequestHeader('X-App-Version', '0.0.1');
    xhr.setRequestHeader('X-Device-Id', para.deviceId);
    xhr.setRequestHeader('X-Lang', 'zh');
    xhr.setRequestHeader('X-Request-Id', para.requestId);
    const body = {};
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 请求成功，处理返回的数据
                callback({ status: xhr.status, readyState: xhr.readyState, data: JSON.parse(xhr.responseText), position: 2 })
            } else {
                // 请求失败，处理错误
                console.error('请求失败，状态码：' + xhr.status);
                callback({ status: xhr.status, readyState: xhr.readyState, data: null, position: 3 })
            }
        }
    }
    xhr.send(JSON.stringify(body));
}

const uploadFile = async (data, callback) => {
    const url = 'https://chatglm.cn/chatglm/backend-api/assistant/file_upload'
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('file', data.file);
    const fileSize = data.file.size;
    xhr.open('POST', url, true);
    //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.onload = function (event) {
        if (this.status === 200) {
            let ret = JSON.parse(event.target.responseText);
            ret.result.file_size = fileSize;
            ret.result.order = data.order;
            callback(ret);
        } else {
            callback({ message: '上传文件出错！', result: null, status: -1 });
        }

    }
    xhr.onerror = function (error) {
        console.error('上传出现网络错误');
    }
    xhr.send(formData);
}