import React, { useState, useRef, useEffect } from "react"
import { Button, Input, List, Typography, Badge } from "antd"
import { MessageOutlined, CloseOutlined } from "@ant-design/icons"
import { purple } from "@ant-design/colors";
import type {
  ChatMessage,
  ChatResponse,
  ChatWidgetProps
} from "../../interfaces"
const { Title } = Typography

const ChatWidget: React.FC<ChatWidgetProps> = (
  {
    onSend
  }
) => {
  const [visible, setVisible] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      prompt: "Hi! I’m your Binder’s Parking assistant. Ask me anything about arrivals, departures, or how the system works.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<React.ComponentRef<typeof Input>>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setTimeout(scrollToBottom, 50);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
      
    // when not visible, be sure it's reset
    document.body.style.overflow = "";
  }, [visible])

  const toggleVisibility = () => setVisible(!visible)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((msgs) => [...msgs, { sender: "user", prompt: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const response = await onSend({
        sender: "user",
        prompt: userMessage
      })

      const data: void | ChatResponse = response
      const botMessage = data?.assistant || "No response from bot."

      setMessages((msgs) => [...msgs, { sender: "bot", prompt: botMessage }])
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", prompt: `Error: Could not reach chatbot service. (${error})` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <>
      <Badge dot={messages.some((msg) => msg.sender === "bot" && !visible)}>
        <Button
          type="primary"
          shape="circle"
          icon={visible ? <CloseOutlined /> : <MessageOutlined />}
          size="large"
          onClick={toggleVisibility}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
          aria-label={visible ? "Close chat" : "Open chat"}
        />
      </Badge>

      {visible && (
        <div
          style={{
            position: "fixed",
            bottom: 72,
            right: 24,
            width: 320,
            color: `#FFF`,
            maxHeight: 400,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            borderRadius: 6,
            backgroundColor: `${purple[9]}`,
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
          aria-label="Chat window"
          role="dialog"
          tabIndex={-1}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${purple[6]}`,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Binder's Parking Assistant
            </Title>
          </div>

          <div
            style={{
              flexGrow: 1,
              padding: "8px 16px",
              overflowY: "auto",
              backgroundColor: "#212121",
            }}
            aria-live="polite"
          >
            <List
              dataSource={messages}
              renderItem={(item, i) => (
                <List.Item
                  key={i}
                  style={{
                    justifyContent:
                      item.sender === "user" ? "flex-end" : "flex-start",
                    padding: "2px 0",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "6px 12px",
                      borderRadius: 16,
                      backgroundColor:
                        item.sender === "user" ? `${purple[5]}` : `${purple[3]}`,
                      color: item.sender === "user" ? "#fff" : "#fff",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.prompt}
                  </div>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "8px 12px",
              borderTop: `1px solid ${purple[4]}`,
              display: "flex",
              gap: 8,
            }}
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              ref={inputRef}
              aria-label="Chat input"
            />
            <Button
              type="primary"
              onClick={sendMessage}
              loading={loading}
              aria-label="Send message"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget