import TelegramAPI from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const MyBot = new TelegramAPI(process.env.BOT_TOKEN, { polling: true });

const configuration = new Configuration({
  apiKey: process.env.CHAT_GPT_API_TOKEN
});

const openai = new OpenAIApi(configuration);

MyBot.on('message', async ({ text, chat }) => {
  const chatId = chat.id;

  if (text === '/start') {
    MyBot.sendMessage(
      chatId,
      'Я искуственный интелект chatGPT 3.5 версии, интегрированный в телеграм бота Назаром. Задавайте любые вопрос.'
    );
  }

  const message = await MyBot.sendMessage(chatId, 'Подожди, обрабатываю запрос...');
  console.log('текст сообщения: ', text);

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Ответь на следующий вопрос: ${text}`,
    temperature: 0.2,
    max_tokens: 1024,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.2,
    stop: ['\n+']
  });

  await MyBot.deleteMessage(chatId, message.message_id);

  console.log('Ответ: ', completion.data.choices[0].text);
  await MyBot.sendMessage(chatId, completion.data.choices[0].text);
});
