(function () {
  window.AgentIQChatWidget = {
    init: function (config) {
      const defaultConfig = {
        agent_uid: "",
        theme: "light",
        position: "right",
        width: 450,
        height: 600,
        buttonIcon: "💬",
        buttonBackground: "#4f46e5",
        buttonColor: "#ffffff",
        appBaseUrl: "http://localhost:8002",
        apiBaseUrl: "http://localhost:8001",
        zIndex: 999999,
      };

      // Merge defaults + caller config
      const widgetConfig = { ...defaultConfig, ...config };

      async function fetchRemoteConfig() {
        if (!widgetConfig.agent_uid) return {};

        try {
          const res = await fetch(
            `${widgetConfig.apiBaseUrl}/api/v1/widget/config/${widgetConfig.agent_uid}`,
          );
          if (!res.ok) throw new Error("Failed to fetch widget config");
          return await res.json();
        } catch (err) {
          console.warn("Widget config API error:", err);
          return {};
        }
      }

      async function createWidget() {
        if (!document.body) return;

        // Pull config from API and merge
        const remoteConfig = await fetchRemoteConfig();
        console.log(remoteConfig.data);
        Object.assign(widgetConfig, {
          theme: remoteConfig.data.chat_theme || widgetConfig.theme,
          position: remoteConfig.data.chat_bubble_alignment || widgetConfig.position,
          buttonIcon: remoteConfig.data.chat_icon || widgetConfig.buttonIcon,
          buttonBackground:
            remoteConfig.data.primary_color || widgetConfig.buttonBackground,
          buttonColor: remoteConfig.data.button_color || widgetConfig.buttonColor,
        });

        // ----------------------
        // Create widget container
        // ----------------------
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

        // ----------------------
        // Create iframe
        // ----------------------
        const iframe = document.createElement("iframe");
        const params = new URLSearchParams({
          agent_uid: widgetConfig.agent_uid,
          theme: widgetConfig.theme,
        });
        iframe.src = `${widgetConfig.appBaseUrl}/embed?${params.toString()}`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "16px";

        container.appendChild(iframe);

        // ----------------------
        // Create bubble button
        // ----------------------
        const button = document.createElement("div");
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

        // Render icon (emoji/text vs image URL)
        let originalIconEl;
        if (widgetConfig.buttonIcon.startsWith("http")) {
          const img = document.createElement("img");
          img.src = widgetConfig.buttonIcon;
          img.alt = "chat icon";
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.borderRadius = "50%";
          originalIconEl = img;
        } else {
          const span = document.createElement("span");
          span.textContent = widgetConfig.buttonIcon;
          span.style.fontSize = "24px";
          originalIconEl = span;
        }
        button.appendChild(originalIconEl);

        // Hover effects
        button.addEventListener("mouseover", () => {
          button.style.transform = "scale(1.1)";
        });
        button.addEventListener("mouseout", () => {
          button.style.transform = "scale(1)";
        });

        // ----------------------
        // Toggle widget visibility
        // ----------------------
        let isOpen = false;

        button.addEventListener("click", () => {
          if (!isOpen) {
            // Open
            container.style.display = "block";
            container.style.opacity = "0";
            container.style.transform = "translateY(20px)";
            container.style.transition =
              "opacity 0.3s ease, transform 0.3s ease";
            void container.offsetWidth;
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";

            // Swap icon → down arrow
            button.innerHTML = "&#x25BC;"; // ▼
            isOpen = true;
          } else {
            // Close
            container.style.opacity = "0";
            container.style.transform = "translateY(20px)";
            setTimeout(() => {
              container.style.display = "none";
            }, 300);

            // Restore original icon/image
            button.innerHTML = "";
            button.appendChild(originalIconEl);
            isOpen = false;
          }
        });

      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWidget);
      } else {
        createWidget();
      }
    },
  };
})();
