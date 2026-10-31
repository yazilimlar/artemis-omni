import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
export const runtime = "nodejs";
const allowed = new Set(["General inquiry","Engineering collaboration","Technical support","Project pilot"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function error(message:string,status:number){return NextResponse.json({ok:false,error:message},{status,headers:{"Cache-Control":"no-store"}});}
export async function POST(request:Request){
 const size=Number(request.headers.get("content-length")||0);
 if(size>10000)return error("Message too large.",413);
 const origin=request.headers.get("origin");
 if(origin){try{if(new URL(origin).host!==new URL(request.url).host)return error("Invalid origin.",403);}catch{return error("Invalid origin.",403);}}
 let input:unknown;
 try{input=await request.json();}catch{return error("Invalid JSON.",400);}
 if(!input||typeof input!=="object")return error("Invalid submission.",400);
 const data=input as Record<string,unknown>;
 if(data.website)return NextResponse.json({ok:true,requestId:"received",status:"filtered"});
 const category=typeof data.category==="string"?data.category:"";
 const name=typeof data.name==="string"?data.name.trim():"";
 const email=typeof data.email==="string"?data.email.trim().toLowerCase():"";
 const message=typeof data.message==="string"?data.message.trim():"";
 if(!allowed.has(category)||name.length<1||name.length>120||!emailPattern.test(email)||email.length>254||message.length<10||message.length>4000)return error("Please check your fields.",400);
 const supabaseUrl=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
 const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!supabaseUrl||!serviceKey)return error("Secure messaging is not configured. Please use the existing contact channel.",503);
 const id=randomUUID();
 try{
  const save=await fetch(`${supabaseUrl.replace(/\/$/,"")}/rest/v1/artemis_communications`,{method:"POST",headers:{"apikey":serviceKey,"Authorization":`Bearer ${serviceKey}`,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({id,category,sender_name:name,sender_email:email,message,notification_status:"pending"}),cache:"no-store"});
  if(!save.ok){console.error("artemis_comms_save_failed",{status:save.status});return error("Message could not be saved. Please retry.",503);}
 }catch{console.error("artemis_comms_save_network_error");return error("Message could not be saved. Please retry.",503);}
 let status="queued";
 const resendKey=process.env.RESEND_API_KEY;
 const from=process.env.ARTEMIS_COMMS_FROM;
 const to=process.env.ARTEMIS_COMMS_TO;
 if(resendKey&&from&&to){
  try{
   const sent=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${resendKey}`,"Content-Type":"application/json","Idempotency-Key":id},body:JSON.stringify({from,to:[to],subject:`[ARTEMIS] ${category} · ${id.slice(0,8)}`,text:`Reference: ${id}\nCategory: ${category}\nFrom: ${name} <${email}>\n\n${message}`,reply_to:email}),cache:"no-store"});
   status=sent.ok?"notification-sent":"notification-pending";
  }catch{status="notification-pending";}
 }
 try{await fetch(`${supabaseUrl.replace(/\/$/,"")}/rest/v1/artemis_communications?id=eq.${id}`,{method:"PATCH",headers:{"apikey":serviceKey,"Authorization":`Bearer ${serviceKey}`,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({notification_status:status}),cache:"no-store"});}catch{console.error("artemis_comms_status_update_failed");}
 return NextResponse.json({ok:true,requestId:id,status},{status:202,headers:{"Cache-Control":"no-store"}});
}
