import React, { useEffect, useState, useRef } from 'react'
import { SideBar, SideMenuDetail, List, ListItem } from '../../css/MyPageStyle'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components';


export default function SideMenu() {

    const [isListVisible, setIsListVisible] = useState(false);
    const menuDetailRef = useRef(null);
    const navi = useNavigate();

    const toggleList = () => {
        setIsListVisible(!isListVisible);
    }
    const menuClickHandler = (path) => {
        navi(path);
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuDetailRef.current && !menuDetailRef.current.contains(e.target)) {
                setIsListVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    
    return (
        <SideBar>
            <SideMenuDetail onClick={() => menuClickHandler("/user/password")}>
                <Link to='/user/password'>비밀번호 변경</Link>    
            </SideMenuDetail>

            <SideMenuDetail onClick={toggleList} ref={menuDetailRef}>
                회원 정보
                {isListVisible && (
                    <List>
                        <ListItem onClick={() => menuClickHandler("/user/profile")}>
                            <Link to='/user/profile'>프로필 수정</Link>
                        </ListItem>
                        <ListItem onClick={() => menuClickHandler("/user/bookmark")}>
                            <Link to='/user/bookmark'>북마크 리스트</Link>
                        </ListItem>
                        <ListItem onClick={() => menuClickHandler("/user/myprojects")}>
                            <Link to='/user/myprojects'>내 프로젝트</Link>
                        </ListItem>
                    </List>
                )}
            </SideMenuDetail>

            <SideMenuDetail onClick={() => menuClickHandler("/user/leave")}>
                    <Link to='/user/leave'>회원 탈퇴</Link>
            </SideMenuDetail>


        </SideBar>
    )
}