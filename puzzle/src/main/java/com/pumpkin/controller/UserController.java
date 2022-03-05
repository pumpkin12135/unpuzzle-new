package com.pumpkin.controller;

import com.pumpkin.common.lang.Result;
import com.pumpkin.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author pumpkin
 * @since 2022-02-19
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostMapping("/login")
    public Result login(@Validated @RequestBody User user){
        //从数据库获取昵称，如果获取失败，则添加
        //更新 从Redis获取，如果获取失败，则添加进redis
        String temp;
        temp = redisTemplate.opsForValue().get(user.getUsername());
        if(temp == null){
            redisTemplate.opsForValue().increment(user.getUsername(), 1);
            return Result.succ(1);
        }
        return Result.succ(temp);
    }

    @PostMapping("/logout")
    public Result logout(@Validated @RequestBody User user){
        redisTemplate.opsForValue().increment(user.getUsername(), 1);
        return Result.succ(null);
    }
}
