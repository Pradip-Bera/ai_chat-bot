let prompt= document.querySelector("#prompt");
let chatContainer= document.querySelector(".chat-container");
const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBXmB1mgMxVD3KIRmWS2SAtgTrQ3tLJgfI";
let imagButton = document.querySelector("#imgbutton");
let imginput = document.querySelector("#imgbutton input");
let arrowButton = document.querySelector("#arrowbutton");

let user = {
    message:null,
    file :{
        mime_type:null,
        data: null
    }
}

async function generateResponse(aiChatBox) 
{
    let text = aiChatBox.querySelector(".ai-chat-area");
    let requestOption = {
        method: "POST",
        headers : {'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [{
        "parts":[{"text": user.message},
            (user.file.data?[{"inline_data":user.file}]:[])]
        }]

        })
    }

    try {
        let response = await fetch(api_url,requestOption);
         let data = await response.json();
         let apiResponse = data.candidates[0].content.parts[0].text.trim();
         apiResponse = apiResponse
         .replace(/(?:\r\n|\r|\n)/g, "<br>") // Preserve line breaks
         .replace(/### (.*?)<br>/g, "<h3>$1</h3>") // Convert ### Heading → <h3>
         .replace(/## (.*?)<br>/g, "<h2>$1</h2>")  // Convert ## Heading → <h2>
         .replace(/# (.*?)<br>/g, "<h1>$1</h1>")   // Convert # Heading → <h1>
         .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold (**text**)
         .replace(/\*(.*?)\*/g, "<i>$1</i>"); 
         
         text.innerHTML = apiResponse;

         aiChatBox.style.width = "auto"; 
        aiChatBox.style.maxWidth = "90%"; 
    }
    catch(error)
    {
        console.log(error);
    }  
    finally
    {
       chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
    user.file={};
    }
}




function createChatBox(html,classes)
{
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}


function handleChatbox(message)
{
    user.message=message;
    let html =`
            <div class="user-chat-area">
                ${user.message}
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.
                    data}" class="chooseimg" />`:""}
            </div>
            <img src="images/user.png.png" id="userimg">`;
    prompt.value="";
     prompt.style.height = "auto";
    prompt.focus();

    let userChatBox = createChatBox(html,"user-chat-box");
    chatContainer.appendChild(userChatBox);
    
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
    

    setTimeout(()=>{
        let html = `<img src="images/ai.png.png" id="aiimg" width="8%">
            <div class="ai-chat-area">
                 <img src="images/loading.png.gif" class="load">
            </div>`;
            let aiChatBox = createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox);

    },600)
}

prompt.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleChatbox(prompt.value);
        setTimeout(() => {
            prompt.value = "";  
            prompt.style.height = "auto"; // Reset textarea height
            prompt.focus(); // Keep cursor in input field
        }, 100);  // Small delay ensures smooth reset
    }
});

// auto expand 
const textarea = document.getElementById("prompt");

textarea.addEventListener("input", function() {
    this.style.height = "auto"; // Reset height
    this.style.height = this.scrollHeight + "px"; // Adjust height based on content
});


arrowButton.addEventListener("click",()=>{
    handleChatbox(prompt.value);
});

imginput.addEventListener("change",()=>{

    const file = imginput.files[0];
    if(!file)
    {
        return;
    }
    let reader = new FileReader();
    reader.onload=(e)=>{

    let base64sting = e.target.result.split(",")[1];
    user.file={
        mime_type:file.type,
        data:base64sting
    }
    }

    reader.readAsDataURL(file);
})

imagButton.addEventListener ("click",()=>{
    imagButton.querySelector("input").click();
})