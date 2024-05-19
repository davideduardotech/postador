const express = require('express')
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/userModel');
const Chatbot = require('../models/chatbotModel');
const Reply = require('../models/replyModel');
const Post = require('../models/postModel');

const routerWebhook = express.Router();


routerWebhook.get("/", async (req, res) => { // verificar assinatura webhook
	const hubVerifyToken = req.query['hub.verify_token'];
	const hubChallenge = req.query['hub.challenge'];
	const token = process.env.FACEBOOK_VERIFY_TOKEN;
	if (hubVerifyToken === token) {
		res.status(200).send(hubChallenge);
	} else {
		res.status(403).send('falha na verificação. Incompatibilidade de token.');
	}
})

// Função para enviar uma resposta

async function sendMessage({ chatbot, pageId, senderId, children }) {
	try {
		// pegar accessToken da pagina
		const user = await User.findById(chatbot.user);
		if (!user) return { status: false, error: `usuário(${chatbot.user}) não encontrado` };

		const page = user.pages.find(page => page.idPage === pageId);
		if (!page) return { status: false, error: `página(${pageId}) não encontrada` };

		//const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;


		const url = `https://graph.facebook.com/v12.0/${page.idPage}/messages?access_token=${page.accessToken}`;

		let mensagem = {};

		if (children.type === "card" && children.content?.elements?.length > 0) { // Card Template, Reference: https://developers.facebook.com/docs/messenger-platform/reference/templates/generic
			mensagem = {
				recipient: { id: senderId },
				message: {
					attachment: {
						type: "template",
						payload: {
							template_type: "generic",
							elements: []
						}
					}
				}
			};

			children.content.elements.forEach(element => {
				const newElement = {
					title: element.title,
					subtitle: element.subtitle,
					image_url: element.image_url,
					buttons: []
				};

				if (element.buttons?.length > 0) {
					element.buttons.forEach(button => {
						if (button.type === "postback") {
							newElement.buttons.push({ type: button.type, title: button.title, payload: button.payload });
						}

						if (button.type === "web_url") {
							newElement.buttons.push({ type: button.type, title: button.title, url: button.url });
						}
					});
				}

				if(!newElement.buttons.length){
					delete newElement.buttons;
				}
				
				mensagem.message.attachment.payload.elements.push(newElement);

			});
		}

		else if (children.type === "message") {
			if (children.buttons?.length > 0) { // Button Template, Reference: https://developers.facebook.com/docs/messenger-platform/reference/templates/button
				mensagem = {
					recipient: { id: senderId },
					message: {
						attachment: {
							type: "template",
							payload: {
								template_type: "button",
								"text": children.content,
								buttons: []
							}
						}
					}
				};

				children.buttons.forEach(button => {
					if (button.type === "postback") {
						mensagem.message.attachment.payload.buttons.push({ type: button.type, title: button.title, payload: button.payload });
					}

					if (button.type === "web_url") {
						mensagem.message.attachment.payload.buttons.push({ type: button.type, title: button.title, url: button.url });
					}

				});
			} else {
				mensagem = {
					recipient: { id: senderId },
					messaging_type: "RESPONSE",
					message: { text: children.content }
				};

			}

		}

		else if (children.type === "audio" && children.audio?.audio_url) {
			mensagem = {
				recipient: { id: senderId }, // Substitua pelo ID do usuário que receberá a mensagem
				message: {
					attachment: {
						type: "audio",
						payload: {
							url: children.audio.audio_url
						}
					}
				}
			};
		}

		else if (children.type === "video" && children.video?.video_url) {
			mensagem = {
				recipient: { id: senderId }, // Substitua pelo ID do usuário que receberá a mensagem
				message: {
					attachment: {
						type: "video",
						payload: {
							url: children.video.video_url
						}
					}
				}
			};
		}

		else if (children.type === "image" && children.image?.image_url) {
			mensagem = {
				recipient: { id: senderId },
				messaging_type: "RESPONSE",
				message: {
					attachment: {
						type: "image",
						payload: {
							url: children.image.image_url
						}
					}
				}
			};
		}
		else if (children.type === "file" && children.file?.file_url) {
			mensagem = {
				recipient: { id: senderId },
				messaging_type: "RESPONSE",
				message: {
					attachment: {
						type: 'file',
						payload: {
							url: children.file.file_url,
							is_reusable: true // Define se o anexo pode ser reutilizado
						}
					}
				}
			};
		}


		const requestSendMessage = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(mensagem)
		});

		const responseSendMessage = await requestSendMessage.json();
		return { status: requestSendMessage.ok, response: responseSendMessage };




	} catch (error) {
		return { status: false, response: {}, error: `${error}` };

	}
}




routerWebhook.post("/", async (req, res) => {
	try{
		const body = req.body;
		// body.object 
		// body.entry 

		if (body?.object === 'page' && body?.entry) {
			for (const entry of req.body.entry) {
				// entry.time 
				// entry.id
				// entry.messaging 
				// entry.changes

				console.log('notificação webhook recebida:')
				console.log('body:', body);
				console.log('body.entry:', body.entry);
				console.log('entry.time:', entry.time);
				console.log('entry.id:', entry.id);
				console.log('entry.messaging:', entry.messaging);
				console.log('entry.changes:', entry.changes);

				// CODDING: tratar mensagem recebida no facebook messenger da página
				if (entry.messaging) { 
					for (const [index, message] of entry.messaging.entries()) { 
						// message.sender.id
						// message.recipient.id
						// message.timestamp
						// message.postback
						// message.message

						// CODDING: postback recebido
						if (message.postback) {
							// message.postback.title
							// message.postback.payload
							// message.postback.mid

							// pegar id da página do facebook
							const pageId = message.recipient.id;

							// encontrar chatbot no mongodb usando "pageId" como referência
							const chatbots = await Chatbot.find({ "page.page.idPage": pageId }); 

							for (const chatbot of chatbots) { // percorrer chatbots encontrados
								// chatbot._id
								// chatbot.user
								// chatbot.name
								// chatbot.status
								// chatbot.createdAt
								// chatbot.updateAt
								// chatbot.page
								// chatbot.flowchart

								if (chatbot.status === "ligado") { 
									const trigger = chatbot.flowchart.trigger; 
									// trigger.type
									// trigger.keyword
									// trigger.negativeKeyword
									// trigger.postId

									if(!res.headersSent){
										res.status(200).send('OK');
									}
									

									// pegar payloads de forma recursiva
									function getPayloads({children, lista}){
										// children.type
										// children.content
										// children.children

										
										if(children.type === "message" && children.buttons?.length>0){
											for(const button of children.buttons){
												if(button.type === "postback" && button.children?.length > 0){
													lista[button.payload] = button.children[0];

													getPayloads({children: button.children[0], lista: lista});
												}
											}
										}

										if(children.type === "card" && children.content?.elements?.length > 0){
											for(const element of children.content.elements){
												if(element.buttons?.length > 0){
													for(const button of element.buttons){
														if(button.type === "postback" && button.children?.length > 0){
															lista[button.payload] = button.children[0];

															getPayloads({children: button.children[0], lista: lista});
														}
													}
												}
											}
										}

										if(children.children?.length > 0){
											getPayloads({children: children.children[0], lista: lista});
										}
									}

									// pegar childrens de forma recursiva
									function getChildrens({ children, lista }) {
										lista.push(children);

										if (children.children?.length > 0) {
											getChildrens({ children: children.children[0], lista: lista });
										}
									}

									// criar objeto com payloads encontradas | { <payload>: {...}}
									const payloads = {};
									getPayloads({children: chatbot.flowchart.children[0], lista: payloads})

									// lista contento payloads encontradas | [<payload>, <payload>,<payload>,...]
									const payloadsKeys = Object.keys(payloads);
									if(payloadsKeys.length > 0 && payloadsKeys.includes(message.postback.payload)){  // payload encontrada

										// criar lista de childrens 
										const childrenFound = payloads[message.postback.payload]; 
										console.log('childrenFound:',childrenFound);
										const listaChildrens = [];
										getChildrens({children: childrenFound, lista: listaChildrens});
										console.log('lista de childrens encontrados:',listaChildrens);
										if(listaChildrens.length > 0){
											for(const children of listaChildrens){
												if (children.delay?.seconds) {
													const seconds = parseInt(children.delay.seconds);
													if (seconds) {
														await new Promise(resolve => setTimeout(resolve, seconds * 1000));
													}
												}

												// enviar mensagem
												const senderId = message.sender.id;
												const responseRequest = await sendMessage({ chatbot: chatbot, pageId: pageId, senderId: senderId, children: children });
												console.log('RESPOSTA DA MENSAGEM ENVIADA:', responseRequest);
											}
										}
										

										

									}

									
								}
							}

						} 
						
						// CODDING: mensagem recebida
						if(message.message){ 
							// message.message.text
							

							// pegar id da pagina
							const pageId = message.recipient.id;

							// encontrar chatbot no mongodb usando "idPage"
							const chatbots = await Chatbot.find({ "page.page.idPage": pageId });
							console.log('chatbots encontrados:', chatbots);

							function getChildrens({ children, lista }) {
								lista.push(children);

								if (children.children?.length > 0) {
									getChildrens({ children: children.children[0], lista: lista });
								}
							}

							for(const chatbot of chatbots){
								if (chatbot.status === "ligado") {
									const trigger = chatbot.flowchart.trigger;
									// trigger.type
									// trigger.keyword
									// trigger.negativeKeyword
									// trigger.postId

									if (trigger.type === "message") {
										console.log('mensagem recebida:', message.message.text);
										const regexKeyword = new RegExp(trigger.keyword.split(',').join("|"), "i"); // "i" para fazer a correspondência sem diferenciar maiúsculas de minúsculas
										const regexNegativeKeyword = new RegExp(trigger.negativeKeyword.split(',').join("|"), "i"); // "i" para fazer a correspondência sem diferenciar maiúsculas de minúsculas
										if (regexNegativeKeyword.test(message.message.text)) return res.status(200).send('OK');
										if (regexKeyword.test(message.message.text)) {
											res.status(200).send('OK');

										
											let childrens = [];
											getChildrens({ children: chatbot.flowchart.children[0], lista: childrens });
											console.log('lista de childrens encontradas:',childrens);
											if (childrens.length > 0) {
												for (const children of childrens){
													if (children.delay?.seconds) {
														const seconds = parseInt(children.delay.seconds);
														if (seconds) {
															await new Promise(resolve => setTimeout(resolve, seconds * 1000));
														}
													}

													// enviar mensagem
													const senderId = message.sender.id;
													const responseRequest = await sendMessage({ chatbot: chatbot, pageId: pageId, senderId: senderId, children: children });
													console.log(`responseRequest:`,responseRequest);

												}
											}			
										}
									}



								}
							}
						}
					}
				}

				// CODDING: tratar alterações no feed da página
				if (entry.changes) {
					for (const change of entry.changes) {
						if (change.field === 'feed' && change.value.item == "comment" && change.value.verb == "add") {
							try {
								if (entry.id === "172220209310432") {
									await enviarResposta(change.value.from.id, entry.id, `você ${change.value.from.name}(${change.value.from.id}) comentou "${change.value.message}" na pagina ${entry.id}`);
								}

								const findPost = await Post.findOne({ 'results.id': change.value.post_id });

								if (findPost) {
									const findUser = await User.findById(findPost.idUser)

									if (findUser && !findUser.isBlocked) {
										const findReply = await Reply.findOne({ idPost: findPost._id });

										if (!findReply) continue

										if (change.field == 'feed') {
											const findResult = findPost.results.find(item => item.id == change.value.post_id)

											if (!findResult) continue

											const findPage = findUser.pages.find(item => item.idPage == findResult.idPage)

											if (!findPage) continue

											if (findPage.idPage == change.value.from.id) continue

											const findAnsweredComment = findReply.answered.find(item => item.idComment == change.value.comment_id)

											if (!findAnsweredComment) {
												if (findReply.limit === findReply.answered.length) {
													await Reply.findByIdAndUpdate(findReply._id, { status: false });

													await Post.findByIdAndUpdate(
														findReply.idPost,
														{
															replyCommentsStatus: false,
														},
													);
												} else {
													const randomIndex = Math.floor(Math.random() * findReply.contents.length);
													const randomContent = findReply.contents[randomIndex];

													const responseUrl = `https://graph.facebook.com/v16.0/${change.value.comment_id}/comments?access_token=${findPage.accessToken}`;

													await axios.post(responseUrl, { message: randomContent });

													await Reply.findByIdAndUpdate(findReply._id, {
														$push: {
															answered: {
																idComment: change.value.comment_id,
															},
														}
													});
												}
											}
										}
									}
								}
							} catch (err) {
								console.log(err)
								continue
							}
						}
					}
				}
			};

			
			if(!res.headersSent){
				res.status(200).send('OK');
			}

			return 
			
		} else {
			return res.status(400)
			
		}


		if(!res.headersSent){
			return res.status(200).send('OK');
		}

		if (req.body && req.body.object === 'page' || req.body.object === 'instagram' && req.body.entry) {
			for (const entry of req.body.entry) {
				if (req.body.object === 'page') {
					for (const message in entry.messaging) {
						console.log(`id: ${entry.id},message:`, entry.messaging[message].message.text, ' object: ', entry.messaging[message]);

						//const response = await enviarResposta(entry.messaging[message].sender.id, entry.messaging[message].recipient.id, entry.messaging[message].message.text);
					}
				} else {
					for (const change of entry.changes) {
						if (change.field === 'feed' && change.value.item == "comment" && change.value.verb == "add") {
							try {
								const findPost = await Post.findOne({ 'results.id': change.value.post_id });

								if (findPost) {
									const findUser = await User.findById(findPost.idUser)

									if (findUser && !findUser.isBlocked) {
										const findReply = await Reply.findOne({ idPost: findPost._id });

										if (!findReply) continue

										if (change.field == 'feed') {
											const findResult = findPost.results.find(item => item.id == change.value.post_id)

											if (!findResult) continue

											const findPage = findUser.pages.find(item => item.idPage == findResult.idPage)

											if (!findPage) continue

											if (findPage.idPage == change.value.from.id) continue

											const findAnsweredComment = findReply.answered.find(item => item.idComment == change.value.comment_id)

											if (!findAnsweredComment) {
												if (findReply.limit === findReply.answered.length) {
													await Reply.findByIdAndUpdate(findReply._id, { status: false });

													await Post.findByIdAndUpdate(
														findReply.idPost,
														{
															replyCommentsStatus: false,
														},
													);
												} else {
													const randomIndex = Math.floor(Math.random() * findReply.contents.length);
													const randomContent = findReply.contents[randomIndex];

													const responseUrl = `https://graph.facebook.com/v16.0/${change.value.comment_id}/comments?access_token=${findPage.accessToken}`;

													await axios.post(responseUrl, { message: randomContent });

													await Reply.findByIdAndUpdate(findReply._id, {
														$push: {
															answered: {
																idComment: change.value.comment_id,
															},
														}
													});
												}
											}
										}
									}
								}
							} catch (err) {
								console.log(err)
								continue
							}
						}
					}
				}
			};

			res.status(200).send('OK');
		} else {
			res.status(400)
		}
	}catch(error){
		if(!res.headersSent){
			return res.status(200).send("OK");
		}
	}
})

module.exports = routerWebhook;