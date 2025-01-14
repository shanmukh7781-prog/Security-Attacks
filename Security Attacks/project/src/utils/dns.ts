import axios from 'axios';

export async function resolveDomain(domain: string): Promise<string> {
  try {
    const response = await axios.get(`https://dns.google/resolve?name=${domain}`);
    if (response.data.Answer && response.data.Answer.length > 0) {
      return response.data.Answer[0].data;
    }
    throw new Error('No IP address found');
  } catch (error) {
    throw new Error('Failed to resolve domain');
  }
}