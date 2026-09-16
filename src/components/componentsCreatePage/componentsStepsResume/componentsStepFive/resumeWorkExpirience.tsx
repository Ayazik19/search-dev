import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hookRedux";
import { useForm, UseFormSetValue } from "react-hook-form";
import FpContWorkExpirience from "./fpConts/fpContWorkExpirience";
import { post, Positions, WorkingTime, Resume, Post } from "../../../../types/typesResume";
import { setChangeScroll } from "../../../../store/isMainScrollSlice";
import { setAmountTimeWorked, setChangeDataPostArr, setChangeFieldPost, setPosition } from "../../../../store/resumesSlice";
import useSetUpdAmountTimeWorkedPoss, { checkAllValidateHooks } from "../../../../globalFuncs";
import Buttons from "./buttons";


interface PropsStepFive {
    valueTypeWorkInp: string;
    errorsTypeWorkInp: string;
    setValueTypeWorkInp: (value: string) => void;
    setErrorsTypeWorkInp: (value: string) => void;
}

interface PositionsForm {
    idPosition: number,
    generalTimeWork?: string,
    nameCompany?: string,
    cityCompany?: string,
    postName: string,
    descriptionPost: string,
    workingTime?: WorkingTime,
    typeWorkResume: string
    // a - Yes, i have commercial experience
    // b - No, but I have pet projects
    // c -I have no pet projects and commercial experience
}

interface Handles {
    changePostArr: (nameField: string, value: string, updPost: Post[]) => { changedPost: Post[] }
}

export const setValuesInpsWorkExp = (
    setValue: UseFormSetValue<PositionsForm>,
    typeOperations: string,
    idPos: number,
    setValueNamePost: (value: string) => void,
    resumesState: Resume) => {
    const fields = [
        "nameCompany",
        "idPosition",
        "generalTimeWork",
        "cityCompany",
        "postName",
        "descriptionPost",
        "workingTime",
        "typeWorkResume",
        "workingTime.sinceDate",
        "workingTime.toDate",
        "workingTime.countTime",
        "workingTime.countTime.year",
        "workingTime.countTime.month"
    ] as const;
    if (typeOperations === 'changePos') {

        const statePositions = resumesState.positions;

        const findChangeObj = statePositions && statePositions.find(item => item.idPosition === idPos);
        if (findChangeObj) {
            setValue('nameCompany', findChangeObj.nameCompany)
            setValue('cityCompany', findChangeObj.cityCompany)
            if (findChangeObj.post) {
                const postLength = findChangeObj.post.length;
                setValue('postName', findChangeObj.post[postLength - 1]?.postName)
                setValue('descriptionPost', findChangeObj.post[postLength - 1]?.descriptionPost)
                setValueNamePost(findChangeObj.post[postLength - 1]?.postName);
            }
            setValue('workingTime.sinceDate', findChangeObj.workingTime?.sinceDate || '')
            setValue('workingTime.toDate', findChangeObj.workingTime?.toDate || '')
        }
    }
    else {
        fields.forEach(element => {
            setValue(element, '');
        });
    }
}



const ResumeWorkExpirience: React.FC<PropsStepFive> = ({ valueTypeWorkInp }) => {
    const { handleSubmit, formState: { errors }, setValue, register, watch } = useForm<PositionsForm>({ mode: 'onChange' })

    const [changePos, setChangePos] = useState<boolean>(false)

    const [itemChangeDataPos, setItemChangeDataPos] = useState<Positions>()

    const { setUpdAmountTimeWorkedPoss } = useSetUpdAmountTimeWorkedPoss();

    const [isFpContListWorks, setIsFpContListWorks] = useState(false);

    const dispatch = useAppDispatch();



    useEffect(() => {
        if (isFpContListWorks) {
            dispatch(setChangeScroll(false));
        }
        else {
            dispatch(setChangeScroll(true));
        }
    }, [isFpContListWorks])

    const [changeInpTypeDate, setChangeInpTypeDate] = useState<boolean>(false);
    const toDateInp = watch('workingTime.toDate') ?? '';
    const [toDate, setToDate] = useState<string>(toDateInp);


    const handleInpDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChangeInpTypeDate(true);
        setToDate(event.target.value);
    }



    const [post, setPost] = useState<post>([]);

    const [newPost, setNewPost] = useState<boolean>(false);
    

    const nameCompanyInp = watch('nameCompany');
    const cityCompanyInp = watch('cityCompany');
    const postNameInp = watch('postName')
    const postDescInp = watch('descriptionPost')
    const sinceDateInp = watch('workingTime.sinceDate');

    const [errorsNewPostOne, setErrorsNewPostOne] = useState<string>('');
    const [errorsNewPostTwo, setErrorsNewPostTwo] = useState<string>('');
    const [errorPostName, setErrorPostName] = useState<string>('');

    const [activeNameCompInp, setActiveNameCompInp] = useState<boolean>(false);

    const idItemChangePost = itemChangeDataPos && itemChangeDataPos.idPosition;

    useEffect(() => {
        if (newPost) {
            console.log(postNameInp, 'post')
            if (nameCompanyInp !== '' && postNameInp !== '') {
                const postState = statePositions && statePositions[idItemChangePost && idItemChangePost || statePositions.length]?.post;
                const isSameDataPostName = postState && postState.find(item => item.postName === postNameInp);
                const isSameDataPostDesc = postState && postState.find(item => item.descriptionPost === postDescInp);

                console.log(isSameDataPostName && isSameDataPostDesc)

                if (!isSameDataPostName && !isSameDataPostDesc && statePositions) {
                    setPost([...post, {
                        postName: postNameInp,
                        descriptionPost: postDescInp
                    }])
                    // setValue('postName', '');
                    // setValue('descriptionPost', '')
                    setErrorsNewPostOne('')
                    setErrorsNewPostTwo('')
                }
                else if (isSameDataPostName && isSameDataPostDesc) {
                    setErrorsNewPostTwo('You already have the current position data')
                }
                else if (isSameDataPostName || isSameDataPostDesc) {
                    if(isSameDataPostDesc && !isSameDataPostName){
                        setErrorsNewPostTwo('You already have the current position description data')
                    }
                    else if(!isSameDataPostDesc && isSameDataPostName){
                        setErrorsNewPostTwo('You already have the current position name data')
                    }
                    
                }
            }
            else {
                if(nameCompanyInp === ''){
                    setErrorsNewPostOne('Before adding a new position, enter the name of the organization')
                }
                else{
                    setErrorPostName(`Set post name in ${nameCompanyInp}`)
                }
            }
        }

        setNewPost(false);
    }, [newPost])

    useEffect(() => {
        if (nameCompanyInp !== '') {
            setErrorsNewPostOne('');
        }

        if(postNameInp !== ''){
            setErrorPostName('')
            setErrorsNewPostTwo('')
        }
    }, [nameCompanyInp, postNameInp])



    const [valueNamePost, setValueNamePost] = useState<string>('');
    const [valueDescPost, setValueDescPost] = useState<string>('');

    const handleAddNamePostInp = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue('postName', value);
        setValueNamePost(value)
        setErrorsNewPostTwo('')
    };

    const handleAddDescrPost = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setValue('descriptionPost', value);
        setValueDescPost(value)
        setErrorsNewPostTwo('')
    };

    const { resumesState } = useAppSelector(state => state.resumes);

    const statePositions = resumesState.positions;

    const [showErrorToDate, setShowErrorToDate] = useState<boolean>(false);

    useEffect(() => {
        const findValueToDate = statePositions?.find(item => item.workingTime?.toDate === 'to date');
        if (findValueToDate && !changePos) {
            setShowErrorToDate(true)
        }
        else {
            setShowErrorToDate(false)
        }
    }, [resumesState.positions, toDate, changePos])

    


    const changeField: Handles['changePostArr'] = (nameField: string, value: string, updPost: Post[]) => {
        const changedPost = updPost && updPost.map((item, index) => {
            if (index === idItemChangePost) {
                return {
                    ...item,
                    [nameField]: value
                }
            }
            return item;
        })
        return { changedPost };
    }

    const onSubmitForm = (data: Positions) => {
        if (changePos) {
            const idChange = idItemChangePost && idItemChangePost || 0;
            const currentStatePost = statePositions && statePositions[idChange].post;
            console.log(currentStatePost?.length, post.length)
            const isChangedDataPost = currentStatePost?.length !== post.length; //
            if (post?.length >= 1) {
                if (isChangedDataPost) {//if added new posts
                    dispatch(setChangeDataPostArr({ post: post, mainIdPost: idChange }))
                }
                else { // if changed current posts
                    const isChangedName = currentStatePost.find(item => item.postName !== postNameInp)
                    const isChangedDesc = currentStatePost.find(item => item.descriptionPost !== postDescInp);
                    let updPost: Post[] = post;
                    if (isChangedName || isChangedDesc) {
                        if (isChangedName) {
                            const changeFunc = changeField('postName', postNameInp, updPost);
                            updPost = changeFunc.changedPost;
                        }
                        if (isChangedDesc) {
                            const changeFunc = changeField('descriptionPost', postDescInp, updPost);
                            updPost = changeFunc.changedPost;
                        }
                    }
                    dispatch(setChangeDataPostArr({ post: updPost, mainIdPost: idChange }))
                }
            }


            if (typeof idItemChangePost !== 'undefined' && statePositions) {
                const idChangedData = statePositions[idItemChangePost];

                if (idChangedData && typeof idChangedData === 'object') {
                    if (idChangedData.nameCompany !== nameCompanyInp) {
                        dispatch(setChangeFieldPost({ post: idChangedData, field: 'nameCompany', value: nameCompanyInp || '' }));
                    }
                    if (idChangedData.cityCompany !== cityCompanyInp) {
                        dispatch(setChangeFieldPost({ post: idChangedData, field: 'cityCompany', value: cityCompanyInp || '' }));
                    }
                    if (idChangedData.workingTime?.sinceDate !== sinceDateInp) {
                        dispatch(setChangeFieldPost({ post: idChangedData, field: 'workingTime.sinceDate', value: sinceDateInp || '' }));
                        console.log(1)
                    }
                    if (idChangedData.workingTime?.toDate !== toDate) {
                        dispatch(setChangeFieldPost({ post: idChangedData, field: 'workingTime.toDate', value: toDateInp || '' }));
                        console.log(2)
                    }
                }
            }
            setUpdAmountTimeWorkedPoss();
        }
        else {
            const submitData: Positions = {
                idPosition: post && post.length > 0 ? 0 : 1,
                nameCompany: data.nameCompany,
                cityCompany: data.cityCompany,
                post: post && post.length > 0
                    ?
                    post.map(p => ({  postName: p.postName, descriptionPost: p.descriptionPost })) : [
                        {
                            postName: postNameInp,
                            descriptionPost: postDescInp,
                        },
                    ],
                workingTime: {
                    sinceDate: data.workingTime?.sinceDate || '',
                    toDate: data.workingTime?.toDate || '',
                },
            };
            dispatch(setPosition(submitData))
            setUpdAmountTimeWorkedPoss();
        }
        setPost([])
        setValuesInpsWorkExp(setValue, 'setNull', 0, setValueNamePost, resumesState)
    }

    useEffect(() => {
        if (changePos) {
            setIsFpContListWorks(false);
            setErrorsNewPostOne('');
            setErrorsNewPostTwo('')
            setValuesInpsWorkExp(setValue, 'changePos', itemChangeDataPos?.idPosition ?? 0, setValueNamePost, resumesState);

            if (itemChangeDataPos && itemChangeDataPos.post) {
                setPost(itemChangeDataPos.post)
            }
        }
    }, [changePos])

    const [showListPosts, setShowListPosts] = useState<boolean>(false);
    const [selectedIdPost, setSelectedIdPost] = useState<number>(0);

    useEffect(() => {
        if (showListPosts && selectedIdPost == 0) {
            setValue('postName', '');
            setValue('descriptionPost', '');
        }
    }, [showListPosts, selectedIdPost])

    const handleSetFpCont = () => {
        setIsFpContListWorks(true)
        setChangePos(false);
        setErrorsNewPostOne('');
        setErrorsNewPostTwo('')
    }



    useEffect(() => {
        if(!changePos){
            if(!changeInpTypeDate){
                setValue('workingTime.toDate', 'to date')
            }
        }
    }, [changePos, changeInpTypeDate])

    const checkResult = checkAllValidateHooks([errorsNewPostOne !== '' ? true : false, errorsNewPostTwo !== '' ? true : false, showErrorToDate])

    return (
        <>
            <form className="form-position" onSubmit={handleSubmit(onSubmitForm)}>
                <div className="position-info name-company">
                    <span className="name-position-info">Name company</span>
                    <input
                        type='text'
                        className={errorsNewPostOne === '' && !errors?.nameCompany ? "input-position_full-width" : "input-position_full-width_errors"}
                        {...register('nameCompany', {
                            required: 'Set name company'
                        })}
                        onFocus={() => setActiveNameCompInp(true)}
                        onBlur={() => setActiveNameCompInp(false)}
                    />
                    {errors?.nameCompany && errorsNewPostOne === '' && <p className="erorrs-input-position">{errors?.nameCompany.message}</p>}
                    {errorsNewPostOne !== '' && <p className="erorrs-input-position">{errorsNewPostOne}</p>}
                </div>
                <div className="position-info city-company">
                    <span className="name-position-info">City</span>
                    <input
                        type='text'
                        className={!errors?.cityCompany ? "input-position_full-width" : "input-position_full-width_errors"}
                        {...register('cityCompany', {
                            required: 'Set city company'
                        })}
                    />
                    {errors?.cityCompany && <p className="erorrs-input-position">{errors?.cityCompany.message}</p>}
                </div>
                <div className="position-info company-post-name">
                    <span className="name-position-info">Post name</span>
                    <input
                        type='text'
                        className={!errors?.postName && errorsNewPostTwo === '' && errorPostName === '' ? "input-position_full-width" : "input-position_full-width_errors"}
                        {...register('postName', {
                            required: 'Set post name company'
                        })}
                        onChange={handleAddNamePostInp}
                    />
                    {errors?.postName && <p className="erorrs-input-position">{errors?.postName.message}</p>}
                    {errorPostName !== '' && <p className="erorrs-input-position">{errorPostName}</p>}
                </div>
                <div className="position-info company-post-description">
                    <span className="name-position-info">Description</span>
                    <textarea
                        className={errorsNewPostTwo === '' ? "text-position_description-post" : "text-position_description-post_error"}
                        {...register('descriptionPost')}
                        onChange={handleAddDescrPost}
                        placeholder='Describe the skills you used in this position, what types of tasks you worked on'
                    />
                    <div className="text-help-new-post">
                        <span className="text-add-post-company" onClick={() => setNewPost(true)}>
                            Add new post in {!activeNameCompInp && nameCompanyInp !== '' ? nameCompanyInp : 'company'} +
                        </span>
                        {post && post.length > 0 &&
                            <>
                                <span className="info-amount-added-positions">
                                    Added: {post && post.length}
                                </span>
                            </>
                        }
                    </div>
                    {errorsNewPostTwo !== '' && <p className="errors-same-post-data">{errorsNewPostTwo}</p>}
                </div>
                <div className="position-info company-post-time-work">
                    <span className="name-position-info">Time work</span>
                    <div className="date-post-inputs">
                        <input
                            type='date'
                            placeholder="since"
                            className={errors?.workingTime?.sinceDate ? "input-position_small-width-1_errors" : 'input-position_small-width-1'}
                            {...register('workingTime.sinceDate', {
                                required: 'Set since date worked'
                            })}
                        />
                        <input
                            type={changeInpTypeDate || toDateInp !== 'to date' ? 'date' : 'text'}
                            value={changeInpTypeDate || changePos ? toDate : 'to date'}
                            className={errors?.workingTime?.toDate ? "input-position_small-width-2_errors" : 'input-position_small-width-2'}
                            {...register('workingTime.toDate', {
                                required: 'Set to date worked'
                            })}
                            onChange={handleInpDate}
                        />
                    </div>
                    {errors?.workingTime?.sinceDate && !showErrorToDate && !errors?.workingTime?.toDate &&
                        <p className="erorrs-input-position">
                            {errors?.workingTime.sinceDate.message}
                        </p>
                    }
                    {errors?.workingTime?.toDate && !errors?.workingTime?.sinceDate && 
                        <p className="erorrs-input-position">
                            {errors?.workingTime.toDate.message}
                        </p>
                    }
                    {errors?.workingTime?.toDate && errors?.workingTime?.sinceDate && !showErrorToDate && 
                    <p className="erorrs-input-position">
                        Set date worked in {!activeNameCompInp && nameCompanyInp !== '' ? nameCompanyInp : 'company'}
                    </p>}
                    {showErrorToDate && !errors?.workingTime?.sinceDate &&
                        <>
                            <p className="erorrs-input-position">
                                You are already currently working for the company.
                            </p>
                            {!changePos && <p
                                className="errors-input-position_change-data"
                                onClick={() => setIsFpContListWorks(true)}
                            >
                                Change data position?
                            </p>}
                        </>}
                </div>
                <div className="btns-work-expirience">
                    <Buttons
                        type={checkResult}
                        className="btn-work-expirience add-button"
                    >
                        {!changePos ? 'Add place of work +' : 'Change position'}
                    </Buttons>
                    {statePositions && statePositions.length >= 1 &&
                        <Buttons
                            className="btn-work-expirience show-list-button"
                            onClick={() => handleSetFpCont()}
                            type='button'
                        >
                            Show list works
                        </Buttons>
                    }
                </div>
            </form>
            {isFpContListWorks &&
                <FpContWorkExpirience
                    setIsFpContListWorks={setIsFpContListWorks}
                    setChangePos={setChangePos}
                    setItemChangeDataPos={setItemChangeDataPos}
                />}
        </>
    );
}

export default ResumeWorkExpirience;