export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:5000';

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiCall<{ token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    
    register: (name: string, email: string, password: string) =>
      apiCall<{ token: string; user: any }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    
    me: () => apiCall<{ user: any }>("/api/auth/me"),
  },

  chat: {
    send: (message: string) =>
      apiCall<{ response: string; id: string }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    
    history: (limit?: number) =>
      apiCall<{ messages: any[] }>(`/api/chat/history${limit ? `?limit=${limit}` : ""}`),
  },

  subscription: {
    create: (amount: number = 9.99, currency: string = "USD") =>
      apiCall<{ subscription: any; checkoutUrl: string }>("/api/subscription/create", {
        method: "POST",
        body: JSON.stringify({ amount, currency }),
      }),
    
    status: () => apiCall<{ subscription: any; isActive: boolean }>("/api/subscription/status"),
  },

  consultations: {
    create: (data: {
      patientToken: string;
      consultUrl?: string;
      location: string;
      providerId?: string;
      metadata?: string;
    }) =>
      apiCall<{ consultation: any }>("/api/consultations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    
    list: () => apiCall<{ consultations: any[] }>("/api/consultations"),
  },
};
