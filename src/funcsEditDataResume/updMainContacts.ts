import { useAppDispatch, useAppSelector } from "../hookRedux";
import { setBasicInfo } from "../store/resumesSlice";
import { BasicInfo, ContactLinks } from "../types/typesResume";

export const updMainContacts = (
    updPhoneNumber: string,
    updElAdress: string,
    updSocialContacts: ContactLinks[]
) => {
    const dispatch = useAppDispatch();

    const {resumesState} = useAppSelector(state => state.resumes);

    const stateBasicInfo = resumesState.basicInfo;
    const updBasincInfo: BasicInfo = {
        ...stateBasicInfo,
        phoneNumber: updPhoneNumber,
        elAddress: updElAdress,
        socialContactsLinks: updSocialContacts
    }

    dispatch(setBasicInfo(updBasincInfo))
}