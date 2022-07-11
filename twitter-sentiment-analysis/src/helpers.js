const ProgressBar = require('progressbar.js');
const container = document.getElementById('container');


export const stringifyResult = (score, searchTerm) => {
    var keyword;
    var statement;
    if (score >= 0.3) {
        keyword = "Very Positive";
        statement = `Looks like the people of Twitter are quite fond of "${searchTerm}"...`;
    } else if (score >= 0.1) {
        keyword = "Slightly Positive";
        statement = `Looks like the people of Twitter kind of like "${searchTerm}"...`;
    } else if (score <= -0.3) {
        keyword = "Very Negative";
        statement = `Looks like the people of Twitter REALLY don't like "${searchTerm}"...`;
    } else if (score <= -0.1) {
        keyword = "Slightly Negative";
        statement = `Looks like the people of Twitter aren't fans of "${searchTerm}"...`;
    } else {
        keyword = "Neutral";
        statement = `Looks like the people of Twitter are indifferent about "${searchTerm}"...`;
    }
    return {
        keyword: keyword,
        statement: statement
    };
}

export const sentimentToPercentage = (score) => {
    var percentage = 0;
    percentage = 0.50 + (score / 2)
    return parseInt(percentage * 100);
}

export const createResultGraph = (fill, ms) => {
    var bar = new ProgressBar.SemiCircle(container, {
        strokeWidth: 6,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        easing: 'easeInOut',
        duration: ms,
        svgStyle: null,
        text: {
          value: '',
          alignToBottom: false
        },
        from: {color: '#FA4817'},
        to: {color: '#24a90a'},
        // Set default step function for all animate calls
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
          var value = Math.round(bar.value() * 100);
          if (value === 0) {
            bar.setText('');
          } else {
            bar.setText(value);
          }
      
          bar.text.style.color = state.color;
        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';
      bar.animate(fill);
}



// /* page 2 animated text */
// function show_animated_text() {
//     var text = document.getElementById('arrow');
//     text.innerHTML = '&#8681;&nbsp;&#8681;&nbsp;&#8681;';
//     var newDom = '';
//     var animationDelay = 6;

//     for(let i = 0; i < text.innerText.length; i++)
//     {
//         newDom += '<span class="char">' + (text.innerText[i] == ' ' ? '&nbsp;' : text.innerText[i])+ '</span>';
//     }

//     text.innerHTML = newDom;
//     var length = text.children.length;

//     for(let i = 0; i < length; i++)
//     {
//         text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
//     }
// }
