import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const READ_TODOS = gql`
  query todos {
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

function App() {
  const [text, setText] = useState("");
  const { data, loading, error } = useQuery(READ_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [removeTodo] = useMutation(REMOVE_TODO);

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const handleSubmit = e => {
    e.preventDefault();
    createTodo({
      variables: {
        text
      },
      refetchQueries: [
        {
          query: READ_TODOS
        }
      ]
    }).then(() => {
      setText("");
    });
  };

  const handleDelete = id => {
    removeTodo({
      variables: {
        id
      },
      refetchQueries: [
        {
          query: READ_TODOS
        }
      ]
    });
  };

  return (
    <div className="app">
      <h3>Create New Todo</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter todo"
        ></input>
        <button type="submit">Submit</button>
      </form>
      <ul>
        {data.todos.map(todo => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => handleDelete(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
