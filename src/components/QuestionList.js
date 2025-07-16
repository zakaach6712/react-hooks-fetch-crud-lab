
import React, {useEffect , useState} from 'react'

function QuestionList() {

  const [question , setQuestion] = useState([]);

  useEffect(() =>{
    fetch(" http://localhost:4000/questions")
     .then((r) => r.json())
      .then((data) =>{
         setQuestion(data);
      })
      .catch((error) =>{
         console.log("Error Fetching questions", error)
      })
  },[]);

         function handleDelete(id){
          fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        //Remove from state
        setQuestion((prev) => prev.filter((q) => q.id !== id));
      })
        .catch((error) => console.log.error('Error deleting question:', error));

         }

          function handleCorrectAnswerChange(id, newIndex){
            fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
       body:JSON.stringify({
          correctIndex:parseInt(newIndex),
       }),
      
      })
        .then((r) => r.json())
        .then((updatedQuestion) => {
          //update state
          setQuestion((prev) =>
             prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
          );
        })
         .catch((error) => console.log('Error updating correct answer:', error));
          }
  return (
    <section>
      <h1>Quiz Questions</h1>
      {question.length > 0 ? (

        <ul>
          {question.map((q) =>(
            <li key= {q.id} style={{marginBottom: "20px"}}>
               <h3>{q.prompt}</h3>
               <ul>
                {q.answers.map((answer, index) =>(
                  <li key={index}
                      style={{color: index === q.correctIndex ? "green" : "black",}}
                  
                  >
                    {answer}

                  </li>
                ))}
               </ul>
               <label>
                update Correct Answer:
                <select 
                   value={q.correctIndex}
                   onChange={(e) => handleCorrectAnswerChange(q.id, e.target.value)}
                >
                   {q.answers.map((answer, index) => (
                    <option key={index} value={index}>
                      {answer}
                    </option>
                   ))}

                </select>
               </label>
               <br />
               <button onClick={() => handleDelete(q.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : ( 
        <p>Loading questions...</p>
      ) 
    }
      
    </section>
  );
}

export default QuestionList;
