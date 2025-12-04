package com.mobilealarmapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * AlarmReceiver
 * Handles alarm notifications when they fire
 */
public class AlarmReceiver extends BroadcastReceiver {
    private static final String TAG = "AlarmReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String alarmId = intent.getStringExtra("alarm_id");
        String alarmLabel = intent.getStringExtra("alarm_label");
        
        Log.d(TAG, "Alarm fired: " + alarmId + ", Label: " + alarmLabel);
        
        // Notifee will handle the actual notification display
        // This receiver is for additional alarm logic if needed
    }
}