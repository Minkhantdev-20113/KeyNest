import { getProviderById } from '../config/providers';

export async function testApiKey(providerId, apiKey) {
  const provider = getProviderById(providerId);
  if (!provider) {
    return { success: false, error: 'Unknown provider' };
  }

  if (!provider.testEndpoint) {
    return { success: false, error: 'No test endpoint available for this provider' };
  }

  try {
    const headers = {};
    let url = `${provider.apiUrl}${provider.testEndpoint}`;

    switch (providerId) {
      case 'google-gemini':
        url = `${provider.apiUrl}/v1/models?key=${apiKey}`;
        break;
      case 'openai':
      case 'deepseek':
      case 'openrouter':
      case 'groq':
      case 'mistral':
      case 'xai':
      case 'perplexity':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'anthropic':
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'cohere':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'huggingface':
        headers['Authorization'] = `Bearer ${apiKey}`;
        url = `${provider.apiUrl}/models`;
        break;
      case 'replicate':
        headers['Authorization'] = `Token ${apiKey}`;
        break;
      default:
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return {
        success: true,
        status: 'active',
        message: 'API key is valid',
        provider: provider.name,
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        status: 'invalid',
        message: 'API key is invalid or unauthorized',
        provider: provider.name,
      };
    }

    return {
      success: false,
      status: 'error',
      message: `Unexpected response: ${response.status}`,
      provider: provider.name,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        status: 'timeout',
        message: 'Request timed out',
        provider: provider.name,
      };
    }
    return {
      success: false,
      status: 'error',
      message: error.message || 'Network error',
      provider: provider.name,
    };
  }
}

export async function getUsageInfo(providerId, apiKey) {
  const provider = getProviderById(providerId);
  if (!provider) return null;

  try {
    switch (providerId) {
      case 'openai':
        return await getOpenAIUsage(apiKey);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

async function getOpenAIUsage(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        totalUsage: data.total_usage,
        currency: data.currency,
      };
    }
  } catch {
    return null;
  }
  return null;
}
