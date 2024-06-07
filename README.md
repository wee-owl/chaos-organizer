# [Chaos Organizer](https://wee-owl.github.io/chaos-organizer)  

[![Build status](https://ci.appveyor.com/api/projects/status/9kspkos2fy917s8y?svg=true)](https://ci.appveyor.com/project/wee-owl/chaos-organizer)  

## Ключевая идея  

Chaos Organizer - это курсовая работа [Нетологии](https://netology.ru/) с возможностью реализации произвольного дизайна (дизайн приложения разработан самостоятельно).  
Приложение-бот предназначено для хранения текстовой информации, закрепления избранных сообщений, загрузки медиа-файлов (в т.ч. drag-and-drop), их просмотра и скачивания.  

## Технологии
- JavaScript
- HTML
- CSS
- Webpack
- Webpack loaders

[Сервер](https://github.com/wee-owl/chaos-organizer-backend/tree/main) расположен на [glitch.com](https://glitch.com/)  

Внешний вид приложения:  
<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/0ab88804-96e9-4056-82dc-ce24bedda851" width="500" height="">

## Основные функции

* сохранение в истории ссылок и текстовых сообщений;  

* ссылки (`http://` или `https://`) кликабельны и отображаются как ссылки;  

* сохранение в истории изображений, аудио и видео (как файлов) — через drag-and-drop и через иконку загрузки;  

<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/1ce39386-ab41-4e86-9811-3d57e98a76fa" width="500" height="">  

* скачивание файлов на компьютер пользователя (при нажатии на файл в окне сообщений или в соответствующей категории бокового меню);  

* ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т. д.  

## Дополнительные функции

* автоматическое определение геолокации (по координатам и/или IP);  

* воспроизведение видео/аудио через API браузера;  

<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/55d9efe2-d56c-451d-87b2-ed48a7d27246" width="500" height="">  

* отправка команд боту, например, `@chaos: погода`;  

<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/04e2d3d9-0347-4c38-bda2-8d6e59a716f4" width="500" height="">  

* закрепление сообщения к верхней части страницы с помощью символа &#128206; (скрепка) на сообщении;  

<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/6db2bc1f-ec5c-412a-aac8-8862ca34c0a1" width="500" height="">  

* просмотр вложений по категориям: изображения, аудио, видео, ссылки, документы через боковое меню.  

<img src="https://github.com/wee-owl/chaos-organizer/assets/95621680/b7b1ca9d-e885-4c34-9a2e-2115dde9b68d" width="500" height="">  
