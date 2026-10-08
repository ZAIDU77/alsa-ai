'use strict';

/**
 * Alsa AI Messaging Automation
 *
 * This module provides the functions expected by pcBridge.ts.
 * The actual PC bridge endpoints are responsible for performing
 * the WhatsApp/Telegram actions.
 */

const DEFAULT_BRIDGE_URL = 'http://127.0.0.1:8765';

function getBridgeUrl() {
  return process.env.ALSA_BRIDGE_URL || DEFAULT_BRIDGE_URL;
}

async function bridgeRequest(endpoint, body) {
  const url = `${getBridgeUrl()}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          data?.error ||
          data?.message ||
          `Bridge request failed (${response.status})`,
      };
    }

    return {
      success: data?.success !== false,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Alsa PC Bridge is not running',
    };
  }
}

async function sendWhatsAppMessage(phone, message) {
  if (!phone) {
    return {
      success: false,
      error: 'WhatsApp phone number is required',
    };
  }

  if (!message) {
    return {
      success: false,
      error: 'WhatsApp message is required',
    };
  }

  return bridgeRequest('/whatsapp-msg', {
    phone: String(phone),
    message: String(message),
  });
}

async function sendTelegramMessage(link, message) {
  if (!link) {
    return {
      success: false,
      error: 'Telegram link or username is required',
    };
  }

  if (!message) {
    return {
      success: false,
      error: 'Telegram message is required',
    };
  }

  return bridgeRequest('/telegram-msg', {
    link: String(link),
    message: String(message),
  });
}

module.exports = {
  sendTelegramMessage,
  sendWhatsAppMessage,
};