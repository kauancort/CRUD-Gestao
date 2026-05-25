import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout { }
