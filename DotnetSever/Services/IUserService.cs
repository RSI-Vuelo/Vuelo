﻿using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace RSIVueloAPI.Services
{
    public interface IUserService
    {
        string GenerateJWT(UserDTO user);
        bool SaveSession(UserDTO user, string value);
        List<User> Get();
        User Get(string id);
        User Create(UserDTO user);
        void Update(string id, User userIn, string password);
        void Remove(User userIn);
        void Remove(string id);
        bool AddHeliFavorite(string newEntry, string username);

        bool DeleteHeliFavorite(string entry, string username);
        User LoginUser(string username, string password);
        User LogoutUser(UserDTO dto);
        User ForgotPassword(string emailAddress);
        User ChangePassword(string password, string code);

    }
}