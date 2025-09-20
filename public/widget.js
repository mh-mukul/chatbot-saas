(function () {
  window.NimbusChatWidget = {
    init: function (config) {
      // Default configuration
      const defaultConfig = {
        agent_id: "",
        theme: document.documentElement.classList.contains('dark') ? "dark" : "light", // Auto-detect theme from parent page if possible
        position: "right", // right or left
        width: 350,
        height: 500,
        buttonIcon: "💬",
        buttonBackground: "#4f46e5",
        buttonColor: "#ffffff",
        title: "Chat Assistant",
        baseUrl: window.location.origin, // Default to current origin
        zIndex: 999999,
      };
      
      // Merge default config with provided config
      const widgetConfig = { ...defaultConfig, ...config };
      
      function createWidget() {
        if (!document.body) return;
        
        // Create widget container
        const container = document.createElement("div");
        container.id = "nimbus-chat-widget-container";
        container.style.position = "fixed";
        container.style.bottom = "90px";
        container.style[widgetConfig.position] = "20px";
        container.style.width = `${widgetConfig.width}px`;
        container.style.height = `${widgetConfig.height}px`;
        container.style.display = "none";
        container.style.boxShadow = "0 12px 24px -6px rgba(0, 0, 0, 0.25)";
        container.style.borderRadius = "16px";
        container.style.overflow = "hidden";
        container.style.zIndex = widgetConfig.zIndex;
        document.body.appendChild(container);

        // Create iframe to load the chat UI
        const iframe = document.createElement("iframe");
        
        // Build query parameters for iframe URL
        const params = new URLSearchParams({
          agent_id: widgetConfig.agent_id,
          theme: widgetConfig.theme,
        });
        
        // Use configured baseUrl or default to window.location.origin
        iframe.src = `${widgetConfig.baseUrl}/embed?${params.toString()}`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "16px";
        
        // Set data attributes for theme to the iframe container
        container.setAttribute("data-theme", widgetConfig.theme);
        container.className = widgetConfig.theme === "dark" ? "nimbus-dark-theme" : "nimbus-light-theme";
        
        // Add CSS variables directly to the container to ensure proper styling
        if (widgetConfig.theme === "dark") {
          container.style.setProperty("--embed-bg", "hsl(240 10% 3.9%)");
          container.style.setProperty("--embed-text", "hsl(0 0% 98%)");
          container.style.setProperty("--embed-border", "hsl(240 3.7% 15.9%)");
        } else {
          container.style.setProperty("--embed-bg", "hsl(0 0% 100%)");
          container.style.setProperty("--embed-text", "hsl(240 10% 3.9%)");
          container.style.setProperty("--embed-border", "hsl(240 5.9% 90%)");
        }
        
        // Add a listener to ensure theme is synced after iframe loads
        iframe.onload = function() {
          try {
            // Attempt to communicate theme to iframe content
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
              if (widgetConfig.theme === "dark") {
                iframeDoc.documentElement.classList.add("dark");
                iframeDoc.documentElement.setAttribute("data-theme", "dark");
                iframeDoc.body.classList.add("dark-theme");
              } else {
                iframeDoc.documentElement.classList.remove("dark");
                iframeDoc.documentElement.setAttribute("data-theme", "light");
                iframeDoc.body.classList.remove("dark-theme");
              }
            }
          } catch (e) {
            // Silently fail if cross-origin issues prevent access
            console.log("Note: Could not directly set theme in iframe due to cross-origin restrictions.");
          }
        };
        
        container.appendChild(iframe);

        // Create chat button
        const button = document.createElement("div");
        button.innerHTML = widgetConfig.buttonIcon;
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style[widgetConfig.position] = "20px";
        button.style.width = "60px";
        button.style.height = "60px";
        button.style.borderRadius = "50%";
        button.style.background = widgetConfig.buttonBackground;
        button.style.color = widgetConfig.buttonColor;
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.cursor = "pointer";
        button.style.zIndex = widgetConfig.zIndex;
        button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        button.style.transition = "transform 0.2s ease-in-out";
        document.body.appendChild(button);

        // Add hover effect
        button.addEventListener("mouseover", () => {
          button.style.transform = "scale(1.1)";
        });
        
        button.addEventListener("mouseout", () => {
          button.style.transform = "scale(1)";
        });

        // Toggle widget visibility on button click
        button.addEventListener("click", () => {
          if (container.style.display === "none") {
            container.style.display = "block";
            // Add a simple animation
            container.style.opacity = "0";
            container.style.transform = "translateY(20px)";
            container.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            
            // Force reflow
            void container.offsetWidth;
            
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
          } else {
            container.style.opacity = "0";
            container.style.transform = "translateY(20px)";
            
            setTimeout(() => {
              container.style.display = "none";
            }, 300);
          }
        });
      }

      // Initialize widget when DOM is ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWidget);
      } else {
        createWidget();
      }
    }
  };
})();
