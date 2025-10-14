/**
 * listModels.js
 * 用来列出当前 Google Generative AI (Gemini) 可用的模型。
 * 运行命令示例：
 *    node listModels.js
 * 或
 *    GEN_AI_KEY=你的_API_KEY node listModels.js
 */

import axios from "axios";

// ✅ 从环境变量读取 API key（推荐做法）
// 如果你想直接写死测试，也可以临时把下面注释改开
const API_KEY = process.env.GEN_AI_KEY || "AIzaSyAR4x79BHm2rgNgmEjESa7ww8BlmzTcXRI"; // 👈 替换成你自己的 Gemini API Key

// API 端点
const URL = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

async function listModels() {
  try {
    console.log("📡 正在获取模型列表...\n");
    const response = await axios.get(URL);

    // 打印所有模型信息
    const models = response.data.models;
    console.log("✅ 成功获取模型列表：\n");
    models.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}`);
      if (m.displayName) console.log(`   显示名称: ${m.displayName}`);
      if (m.description) console.log(`   简介: ${m.description}`);
      console.log(`   支持的方法: ${m.supportedGenerationMethods.join(", ")}`);
      console.log("--------------------------------------------------------");
    });
  } catch (error) {
    console.error("\n❌ 请求失败：");
    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("返回体:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

listModels();
