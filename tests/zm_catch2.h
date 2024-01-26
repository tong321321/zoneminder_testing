/*
 * This file is part of the ZoneMinder Project. See AUTHORS file for Copyright information
 *
 modified in kei_dev branch on 20240126 17:50
 sdfdsf
 dsfdsf
 
 ********** TESTING, cannot deploy to UAT 20240126 22:00 ************
 DSFDSF 20240126 22:00 
 DSFDSAF 20240126 22:00 
 DSFDSAF 20240126 22:00 
 ********* End of testing, cannot deploy to UAT  20240126 22:00**************
 
 ********** TESTING, cannot deploy to UAT ************
 DSFDSF
 DSFDSAF
 DSFDSAF
 ********* End of testing, cannot deploy to UAT**************
 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the

delete 1 line
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef ZONEMINDER_TESTS_ZM_CATCH2_H_
#define ZONEMINDER_TESTS_ZM_CATCH2_H_

#include "catch2/catch.hpp"

#include "zm_vector2.h"

inline std::ostream &operator<<(std::ostream &os, Vector2 const &value) {
  os << "{ X: " << value.x_ << ", Y: " << value.y_ << " }";
  return os;
}

#endif //ZONEMINDER_TESTS_ZM_CATCH2_H_
