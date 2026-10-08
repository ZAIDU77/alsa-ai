'use strict';

async function sendWhatsAppMessage(phone, message) {
  if (!phone || !message) {
    return {
      success: false,
      error: 'Phone number and message are required',
    };
  }

  return {
    success: false,
    error: 'WhatsApp automation bridge is not connected',
    phone: String(phone),
    message: String(message),
  };
}

async function sendTelegramMessage(target, message) {
  if (!target || !message) {
    return {
      success: false,
      error: 'Telegram target and message are required',
    };
  }

  return {
    success: false,
    error: 'Telegram automation bridge is not connected',
    target: String(target),
    message: String(message),
  };
}

module.exports = {
  sendWhatsAppMessage,
  sendTelegramMessage,
};