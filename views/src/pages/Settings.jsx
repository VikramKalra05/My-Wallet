import { useContext, useEffect, useRef, useState } from 'react'
import styles from '../css/settings.module.css'
import { AuthContext } from '../context/AuthContext'
import { updateUserDetails } from '../utils/userUtils';

const Settings = () => {
    const { userDetails, setUserDetails } = useContext(AuthContext);
    const [selectedPfp, setSelectedPfp] = useState(null);
    const [photo, setPhoto] = useState(userDetails?.photo)
    const fileInputRef = useRef(null);


    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedPfp(event.target.files[0]);
            setPhoto(URL.createObjectURL(event.target.files[0]));
        } else {
            console.error("No file selected");
        }
    };

    const handleUploadFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    console.log(photo)

    const uploadFile = async () => {
        if (selectedPfp) {

            const formdata = new FormData();
            formdata.append("photo", selectedPfp);

            // formData.append("email", userDetails.email);;
            for (let pair of formdata.entries()) {
                console.log(pair[0], pair[1]); // Logs key-value pairs
            }

            // console.log(formdata, requestOptions);
            await updateUserDetails(formdata)
        }
    };

    useEffect(() => {
        uploadFile();
    }, [selectedPfp]);

    const handleSubmit = () => {

    }


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingCont}>
                <div className={styles.settingHeader}>User Settings</div>
                <div className={styles.settingMain}>
                    <div className={styles.setImgDiv}>
                        <img src={photo ? photo : userDetails?.photo} alt="Profile Photo" loading='lazy' />
                        <input
                            className="inputTag"
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <div className={styles.updatePfpBtn} onClick={handleUploadFile}>UPDATE PHOTO</div>
                    </div>
                    <div>
                        <button onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Settings