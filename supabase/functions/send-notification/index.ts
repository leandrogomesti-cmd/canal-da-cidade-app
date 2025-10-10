/// <reference types="https://deno.land/x/types/deno.d.ts" />

// Importações corretas para Supabase Edge Functions
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore  
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Interfaces para tipagem
interface NotificationRequest {
  user_id: string;
  old_status: string;
  new_status: string;
  title: string;
}

interface User {
  expo_push_token?: string;
  nome?: string;
}

// Função principal da Edge Function
serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Variáveis de ambiente
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Criar cliente Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Parse do body da requisição
    const { user_id, old_status, new_status, title }: NotificationRequest = await req.json()

    console.log('Processando notificação:', { user_id, old_status, new_status, title })

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('expo_push_token, nome')
      .eq('id', user_id)
      .single()

    if (userError) {
      console.error('Erro ao buscar usuário:', userError)
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userData = user as User

    // Verificar se usuário tem token push
    if (!userData.expo_push_token) {
      console.log('Usuário não tem token de push notification')
      return new Response(
        JSON.stringify({ message: 'Usuário sem token push' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mapear status para mensagens amigáveis
    const statusMessages: Record<string, string> = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento', 
      'resolvido': 'Resolvido',
      'cancelado': 'Cancelado'
    }

    const oldStatusText = statusMessages[old_status] || old_status
    const newStatusText = statusMessages[new_status] || new_status

    // Preparar mensagem de notificação
    const notificationBody = `Status alterado de "${oldStatusText}" para "${newStatusText}"`

    // Preparar payload para Expo
    const expoPushMessage = {
      to: userData.expo_push_token,
      sound: 'default',
      title: title || 'Atualização da Ocorrência',
      body: notificationBody,
      data: {
        user_id,
        old_status,
        new_status,
        title,
        type: 'status_change'
      }
    }

    // Enviar notificação via Expo Push API
    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expoPushMessage),
    })

    const expoResult = await expoResponse.json()

    console.log('Resposta da Expo:', expoResult)

    // Verificar se houve erro na Expo
    if (expoResult.data && expoResult.data[0] && expoResult.data[0].status === 'error') {
      console.error('Erro da Expo:', expoResult.data[0])
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao enviar notificação', 
          details: expoResult.data[0]
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Sucesso
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notificação enviada com sucesso',
        expo_response: expoResult
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro geral na Edge Function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: errorMessage
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})