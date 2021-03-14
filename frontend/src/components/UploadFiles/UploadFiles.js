import React, {useState} from 'react';
import { postFile } from "../../requests/requests.js";


export default function UploadFiles(){
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsSelected] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

	const handleSubmission = () => {
		const formData = new FormData();
		const reader = new FileReader();
		formData.append('File', selectedFile);
		selectedFile.text()
			.then(res => postFile(res)
			.then(res => res.text())
			.then(res => console.log(res)))
	};

	return(
   <div>
		<input type="file" name="file" onChange={changeHandler} />
		{isFilePicked ? (
			<div>
				<p>Filename: {selectedFile.name}</p>
				<p>Filetype: {selectedFile.type}</p>
				<p>Size in bytes: {selectedFile.size}</p>
				<p>
					lastModifiedDate:{' '}
					{selectedFile.lastModifiedDate.toLocaleDateString()}
				</p>
			</div>
		) : (
			<p>Select a file to show details</p>
		)}
		<div>
			<button onClick={handleSubmission}>Submit</button>
		</div>
	</div>
	)
}