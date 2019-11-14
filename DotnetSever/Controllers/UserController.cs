﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RSIVueloAPI.Models;
using RSIVueloAPI.Services;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;

namespace RSIVueloAPI.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
      _userService = userService;
    }

    [HttpPost("Authenticate")]
    public IActionResult Authenticate([FromBody]UserDTO dto)
    {
      var user = _userService.LoginUser(dto.UserName, dto.Password);
      if (user.Key == null)
        return StatusCode(StatusCodes.Status404NotFound, user.Value);

      UserDTO newDTO = new UserDTO
      {
        UserName = user.Key.UserName,
        Password = dto.Password,
        Email = user.Key.Email,
        favorites = user.Key.favorites,
        Role = user.Key.Role
      };

      var random = Guid.NewGuid().ToString();
      var jwt = _userService.GenerateJWT(newDTO);

      var options = new CookieOptions()
      {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(5),
            MaxAge = TimeSpan.FromHours(6)
        };
      Response.Cookies.Append("SID", random, options);

      var errorCode = _userService.SaveSession(newDTO, random);
      if (errorCode != ErrorCode.Success)
        return StatusCode(StatusCodes.Status404NotFound, errorCode);

      return Ok(new
      {
        Id = user.Key.Id,
        Username = user.Key.UserName,
        Email = user.Key.Email,
        Favorites = user.Key.favorites,
        token = jwt,
        Role = user.Key.Role
      });
    }

    [HttpGet("[action]")]
    public ActionResult<List<User>> GetAllUsers() =>
        _userService.Get();

    [HttpGet("[action]")]
    public ActionResult<User> GetUser(string id)
    {
      var user = _userService.Get(id);
      if (user == null)
        return StatusCode(StatusCodes.Status404NotFound);
      return user;
    }

    [HttpPost("[action]")]
    public ActionResult<User> CreateUser(UserDTO user)
    {
      var addedUser = _userService.Create(user);
      if (addedUser.Key == null)
        return StatusCode(StatusCodes.Status409Conflict, addedUser.Value);
      return Ok(user);
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult UpdateUser(string id, User userIn)
    {
      var user = _userService.Get(id);
      if (user == null)
        return StatusCode(StatusCodes.Status409Conflict);
      _userService.Update(id, userIn);
      return Ok(userIn);
    }

    [HttpDelete("{id:length(24)}")]
    public IActionResult DeleteUser(string id)
    {
      var user = _userService.Get(id);
      if (user == null)
        return StatusCode(StatusCodes.Status404NotFound);
      _userService.Remove(user.Id);
      return Ok(user);
    }

    [HttpPut("[action]")]
    public IActionResult AddUserFavorite([FromBody]UserDTO dto)
    {
      var errorCode = _userService.AddHeliFavorite(dto.heliId, dto.UserName);
      if (errorCode != ErrorCode.Success)
        return StatusCode(StatusCodes.Status404NotFound, errorCode);
      return Ok(errorCode);
    }

    [HttpPost("[action]")]
    public IActionResult DeleteUserFavorite([FromBody]UserDTO dto)
    {
      var user = _userService.DeleteHeliFavorite(dto.heliUsername, dto.UserName);
      if (user != ErrorCode.Success)
        return StatusCode(StatusCodes.Status404NotFound, user);
      return Ok(user);
    }

    [HttpPost("[action]")]
    public IActionResult ForgotPassword([FromBody]UserDTO dto)
    {
      var user = _userService.ForgotPassword(dto.Email);
      if (user.Key == null)
        return StatusCode(StatusCodes.Status404NotFound, user.Value);
      return Ok(user);
    }

    [HttpPut("[action]")]
    public IActionResult UpdatePassword([FromBody]UserDTO dto)
    {
      var newUser = _userService.ChangePassword(dto.Password, dto.Code);
      if (newUser == null)
        return NotFound();
      return Ok(newUser);
    }

    [HttpPost("[action]")]
    public IActionResult Logout([FromBody]UserDTO userIn)
    {
      var user = _userService.LogoutUser(userIn);
      if (user.Key == null)
        return StatusCode(StatusCodes.Status404NotFound, user.Value);
      
      foreach (var cookie in Request.Cookies.Keys)
      {
        if (cookie == "SID")
          Response.Cookies.Delete(cookie);
      }
      return Ok(user);
    }
  }
}
