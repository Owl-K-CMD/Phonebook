


const Button = (props) => {

  return (
    <div>

      <button onClick={ () => props.handleDelete(props.id)}>delete</button>

    </div>
  )
}

export default Button;

