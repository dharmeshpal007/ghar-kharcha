import { useParams, useSearchParams } from "react-router";

const PostIdPage = () => {
  const params = useParams();
  const [searchparams, setSearchParams] = useSearchParams();

  const onClick = () => {
    setSearchParams((pre) => {
      const params = pre as URLSearchParams;
      params.set("name", "Hitesh");
      return params;
    });
  };
  return (
    <>
      <div>PostIdPage - {params["id"]}</div>
      <div>
        user : {searchparams.get("name")} <br /> age : {searchparams.get("age")}
      </div>
      <button onClick={onClick}>Change params</button>
    </>
  );
};

export default PostIdPage;
