async function searchMovie() {
    const query = document.getElementById('search-input').value;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '';

    if (!query) {
        resultDiv.textContent = 'Пожалуйста, введите описание фильма.';
        return;
    }

    resultDiv.textContent = 'Поиск...';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-proj-nJWFav2SVS1N2cBuTfPxT3BlbkFJbZtrPC6Sz21mr1MHMUsf`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'Ты помогаешь угадать фильм по описанию максимально точно и даешь ответ только в виде названия фильма похожего на описание' },
                    { role: 'user', content: `Найди фильм по описанию и скинь только название фильма и ничего больше: ${query}` }
                ],
                max_tokens: 550
            })
        });

        const data = await response.json();
        const movieTitle = data.choices[0].message.content.trim();
        
        if (movieTitle) {
            const imageResponse = await fetch(`https://www.googleapis.com/customsearch/v1?q=${movieTitle} фильм обложка &cx=f1e9e03ecbb864730&searchType=image&key=AIzaSyBNVGYjmzOAsMRAgxmRPraxvDQvDmDP90E`);
            const imageData = await imageResponse.json();
            resultDiv.textContent = 'Найдено:';
            
            if (imageData.items && imageData.items.length > 0) {
                const imageUrl = imageData.items[0].link;
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = movieTitle;

                imgElement.style.display = 'block';
                imgElement.style.margin = '20px auto'; 
                resultDiv.appendChild(imgElement);
                
                const titleElement = document.createElement('p');
                titleElement.textContent = movieTitle;
                titleElement.style.textAlign = 'center';
                titleElement.style.marginTop = '10px';
                titleElement.style.fontSize = '20px';
                titleElement.style.color = 'white';
                resultDiv.appendChild(titleElement);
            } else {
                resultDiv.textContent = movieTitle + '\nИзображение не найдено.';
            }
        } else {
            resultDiv.textContent = 'Фильм не найден. Попробуйте описать по-другому.';
        }
    } catch (error) {
        resultDiv.textContent = 'Произошла ошибка при поиске фильма.';
        console.error('Error:', error);
    }
}
