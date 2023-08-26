import { Spinner } from "components/ui";


function MySpinner() {

  return (
    <div className="flex flex-auto flex-col h-[100vh] w-full justify-center items-center">
        <Spinner className="mr-4" size="40px" />
    </div> 
  );
}
export default MySpinner;
