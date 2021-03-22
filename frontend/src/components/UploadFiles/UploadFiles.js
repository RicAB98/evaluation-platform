import React, {useState} from 'react';
import { postFile } from "../../requests/requests.js";


export default function UploadFiles(){
	const [selectedFile, setSelectedFile] = useState();

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = () => {
		const formData = new FormData();
		formData.append('File', selectedFile);
		selectedFile.text()
			.then(res => postFile(res)
			.then(res => res.text())
			.then(res => console.log(res)))
	};

	return(
   <div>
		<input type="file" name="file" onChange={changeHandler} />
		<div>
			<button onClick={handleSubmission}>Submit</button>
		</div>
	</div>
	)
}