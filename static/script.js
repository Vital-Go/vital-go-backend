     // Clean markdown and format output
  function cleanAndFormatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/### (.*?)\n/g, "<h4>$1</h4>")
      .replace(/## (.*?)\n/g, "<h3>$1</h3>")
      .replace(/^- (.*?)(?=<br>|<\/p>)/gm, "• $1")
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br>");
  }

  // Intro message
  window.onload = () => {
    const chatBox = document.getElementById("chat-box");
    const introMessage = `🩺 <strong>Welcome to VITAL-GO</strong> – your AI-powered gateway to smarter, more accessible healthcare.<br><br>
      VITAL-GO is a comprehensive health platform built to empower <em>everyone</em>—from individuals monitoring their well-being to those seeking professional medical advice.<br><br>
      Whether you're managing a condition, proactively tracking your health, or simply exploring wellness tools, VITAL-GO delivers real-time insights, wearable-integrated data, and intelligent guidance—<strong>Everywhere. Anywhere. Anytime.</strong><br><br>
      I'm your virtual assistant—here to help you navigate the VITAL-GO ecosystem and connect you with the tools and experts you need for a healthier life.`;

    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message ai";
    messageDiv.innerHTML = `<strong>AI:</strong><br><p>${introMessage}</p>`;
    chatBox.appendChild(messageDiv);
  };

  // added Enter key to submit
  document.addEventListener("keydown", 
    function(e){
      if(e.key === "Enter"){
        sendMessage();
      }
    });

  // Send message
  async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chat-box");

    // User message
    const userDiv = document.createElement("div");
    userDiv.className = "chat-message user";
    userDiv.innerHTML = `<strong>You:</strong><br><p>${message}</p>`;
    chatBox.appendChild(userDiv);
    input.value = "";

    // Typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      typingIndicator.remove();

      const formatted = cleanAndFormatMarkdown(data.response);
      const aiDiv = document.createElement("div");
      aiDiv.className = "chat-message ai";
      aiDiv.innerHTML = `<strong>AI:</strong><br><p>${formatted}</p>`;
      chatBox.appendChild(aiDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      typingIndicator.remove();
      const errorDiv = document.createElement("div");
      errorDiv.className = "chat-message ai";
      errorDiv.innerHTML = `<strong>AI:</strong><br><p>Error responding. Please try again later.</p>`;
      chatBox.appendChild(errorDiv);
    }
  }

  function lightMode() {
    document.body.classList.remove('dark-mode');
    // Ensure the sun icon is active
    document.querySelector('.togglemenu .fa-sun').classList.add('active-mode');
    document.querySelector('.togglemenu .fa-moon').classList.remove('active-mode');
    localStorage.setItem('theme', 'light'); // Save preference
}

function darkMode() {
    document.body.classList.add('dark-mode');
    // Ensure the moon icon is active
    document.querySelector('.togglemenu .fa-moon').classList.add('active-mode');
    document.querySelector('.togglemenu .fa-sun').classList.remove('active-mode');
    localStorage.setItem('theme', 'dark'); // Save preference
}

function sidemenushow() {
    const sideBar = document.getElementById('sideBar'); // Main sidebar
    const aside = document.getElementById('aside1'); // mobile navbar
    const backshadow = document.getElementById('close-sidebar');

    //adding animations
    sideBar.classList.remove('slide-out');
    sideBar.classList.add('slide-in');
    aside.classList.add('slide-out');
    aside.classList.remove('slide-in');

    // Show the sidebar and toggle icons
    sideBar.style.display = 'block';
    sideBar.style.opacity ='1';
    aside.style.opacity = '0';
    backshadow.style.display = 'block';
}

function sidemenunone() {
    const sideBar = document.getElementById('sideBar'); // Main sidebar
    const aside = document.getElementById('aside1'); //mobile navbar
    const backshadow = document.getElementById('close-sidebar');

    //adding animations
    sideBar.classList.remove('slide-in');
    sideBar.classList.add('slide-out');
    aside.classList.remove('slide-out');
    aside.classList.add('slide-in');

    // Hide the sidebar and toggle icons
    sideBar.style.opacity = '0';
    aside.style.display = 'block';
    aside.style.opacity ='1';
    backshadow.style.display = 'none'; 
}

function activelink(){
    const navLinks = document.querySelectorAll('.linkpages a, .linkpages1 a');
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(lin => {
        const href = lin.href.split("/").pop();
        if (href === currentPage){
            lin.classList.add('active');
        }
    });
}

activelink();

document.addEventListener('DOMContentLoaded', function() {
    // Handles active theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.togglemenu .fa-moon').classList.add('active-mode');
        document.querySelector('.togglemenu .fa-sun').classList.remove('active-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.togglemenu .fa-sun').classList.add('active-mode');
        document.querySelector('.togglemenu .fa-moon').classList.remove('active-mode');
    }

    // Including continues typing of vital-go
    new Typed("#motto", {
        strings: ["Our Motto:", "Connected Health.", "Empowered Lives.", "Your Health.", "Anywhere.", "Anytime."],
        typeSpeed: 250,
        loop: true
    });
});