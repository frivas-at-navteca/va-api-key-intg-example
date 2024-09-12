import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, Box, Flex, Input, Button, Spinner, Text, VStack, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { Send } from 'lucide-react';

interface Message {
  content: string;
  isUser: boolean;
}

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('<CUSTOM_BACKEND_URL>', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.answer) {
        throw new Error('Response from server is missing the "response" field');
      }
      const botMessage: Message = { content: data.answer, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      const errorMessage: Message = { content: 'Sorry, I encountered an error. Please try again.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.100" h="100vh" display="flex" flexDirection="column">
        <Box flex="1" display="flex" justifyContent="center" alignItems="center" p={4}>
          <Box w="100%" maxW="xl" h="100%" display="flex" flexDirection="column" bg="white" boxShadow="md" rounded="lg" overflow="hidden">
            <Box bg="blue.500" color="white" p={4} textAlign="center">
              <Text fontSize="xl" fontWeight="bold">Chatbot</Text>
            </Box>
            <VStack flex="1" p={4} spacing={4} overflowY="auto">
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
                  bg={message.isUser ? 'blue.500' : 'gray.200'}
                  color={message.isUser ? 'white' : 'black'}
                  p={2}
                  borderRadius="md"
                  maxW="80%"
                  align="center"
                >
                  <Text>{message.content}</Text>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
            {error && <Text color="red.500" textAlign="center">{error}</Text>}
            <Box as="form" onSubmit={sendMessage} p={4} bg="gray.50" boxShadow="inner">
              <Flex>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  flex="1"
                  mr={2}
                  disabled={isLoading}
                />
                <Button type="submit" colorScheme="blue" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : <Send />}
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}