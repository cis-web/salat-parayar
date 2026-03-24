self.addEventListener("notificationclick",function(e){

e.notification.close()

e.waitUntil(

clients.matchAll({type:"window"}).then(clientsArr=>{

for(let c of clientsArr){

if(c.url && "focus" in c) return c.focus()

}

if(clients.openWindow)
return clients.openWindow("/")

})

)

})